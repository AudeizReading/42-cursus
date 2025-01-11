import { ChatService } from '$app/chat/chat.service';
import { UserService } from '$app/user/user.service';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import {
	ReadMessageDto,
	SendMessageDto,
	SendMessageRto,
	TyppingDto,
} from './socket.schema';
import { Message } from '$app/chat/chat.schema';
import { NotificationService } from '$app/notification/notification.service';
import { NotificationEventService } from '$app/notification/notification-event.service';
import { EventType } from '$app/notification/notification.interface';
import { Notification } from '$app/notification/notification.schema';
import { EventEmitter } from 'events';
import { UserPublic } from '$app/user/user.interface';

@Injectable()
export class SocketService {
	static eventEmitter = new EventEmitter();

	static connectedClients: Map<string, Socket> = new Map();
	static connectedUser: Map<number, string[]> = new Map();

	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		@Inject(forwardRef(() => ChatService))
		private readonly chatService: ChatService,
		@Inject(forwardRef(() => NotificationService))
		private readonly notificationService: NotificationService,
		private readonly configService: ConfigService,
		private readonly loggerService: Logger,
		private readonly jwtService: JwtService,
	) {
		if (process.env.NODE_ENV == 'test' || process.env.TEST == 'true')
			SocketService.eventEmitter.setMaxListeners(0);
		NotificationEventService.eventEmitter.on(
			'notification',
			async (
				type: EventType,
				fromUser: UserService,
				user: UserService,
				messageId?: number,
			) => {
				const notification: Notification =
					await this.notificationService.newNotification(
						type,
						fromUser,
						user,
						messageId,
					);
				await this.sendNotification(notification);
			},
		);
	}

	async canActivate(socket: Socket): Promise<UserService | undefined> {
		const token = socket.handshake.auth.token;
		if (!token) {
			this.loggerService.error('You must be logged in', 'SocketService');
			socket.emit('error', 'You must be logged in');
			socket.disconnect();
			return undefined;
		}
		let user: UserService;
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('secretJWT'),
			});
			user = await this.userService.getByPK(payload.id);
		} catch {
			this.loggerService.error('Are you a hacker?', 'SocketService');
			socket.emit('error', 'Are you a hacker?');
			socket.disconnect();
			return undefined;
		}
		if (!user.isValidateEmail()) {
			this.loggerService.error(
				'Your email must be validated',
				'SocketService',
			);
			socket.emit('error', 'Your email must be validated');
			socket.disconnect();
			return undefined;
		}
		if (!(await user.isComplete())) {
			this.loggerService.error(
				'Your profil is not complete',
				'SocketService',
			);
			socket.emit('error', 'Your profil is not complete');
			socket.disconnect();
			return undefined;
		}
		const userId = user.getId();
		SocketService.connectedClients.set(socket.id, socket);
		if (SocketService.connectedUser.get(userId) == undefined) {
			SocketService.connectedUser.set(userId, [socket.id]);
			await user.setOnline();
			SocketService.eventEmitter.emit('connect', user.getId());
			this.loggerService.log(
				`${user.getUsername()} Online`,
				'SocketService',
			);
			await SocketService.onlineStatusMatchChange(user);
		} else {
			SocketService.connectedUser.set(userId, [
				...SocketService.connectedUser.get(userId),
				socket.id,
			]);
		}
		return user;
	}

	async disconectedClient(
		user: UserService,
		clientId: string,
	): Promise<void> {
		SocketService.connectedClients.delete(clientId);
		const clients: string[] =
			SocketService.connectedUser.get(user.getId()) || [];
		const updatedClients = clients.filter((client) => client !== clientId);

		if (updatedClients.length === 0) {
			SocketService.connectedUser.delete(user.getId());
			await user.setOffline();
			SocketService.eventEmitter.emit('disconnect', user.getId());
			this.loggerService.log(
				`${user.getUsername()} Offline`,
				'SocketService',
			);
			await SocketService.onlineStatusMatchChange(user);
		} else {
			SocketService.connectedUser.set(user.getId(), updatedClients);
		}
	}

	async handleConnection(socket: Socket): Promise<void> {
		const user = await this.canActivate(socket);
		if (user == undefined) return;
		const clientId = socket.id;
		this.loggerService.log(`Connect: ${clientId}`, 'SocketService');
	}

	static socketToUserId(socket: Socket): number {
		return SocketService.idSocketToUserId(socket.id);
	}

	private static idSocketToUserId(idSocket: string): number {
		let userId: number;
		SocketService.connectedUser.forEach((value: string[], key: number) => {
			for (let i = 0; i < value.length; i++) {
				if (value[i] == idSocket) {
					userId = key;
				}
			}
		});
		if (userId == undefined) {
			throw new Error('User not found');
		}
		return userId;
	}

	async sendMessage(
		socket: Socket,
		payload: SendMessageDto,
	): Promise<SendMessageRto> {
		let status: boolean;
		try {
			const senderId = SocketService.socketToUserId(socket);
			const receiveId = payload.userId;
			const msg = payload.message;
			await this.chatService.sendMessage(senderId, receiveId, msg);
			status = true;
		} catch (err) {
			this.loggerService.error(err);
			status = false;
		}
		return { status };
	}

	static async sendMessageUser(message: Message): Promise<void> {
		const senderSockets: string[] = SocketService.connectedUser.get(
			message.sender.id,
		);
		const receiveSockets: string[] = SocketService.connectedUser.get(
			message.receiver.id,
		);
		const sockets: string[] = [];
		if (senderSockets != undefined) sockets.push(...senderSockets);
		if (receiveSockets != undefined) sockets.push(...receiveSockets);
		for await (const socketId of sockets) {
			const socket = SocketService.connectedClients.get(socketId);
			socket.emit('message', message);
		}
		await SocketService.sendUnreadMessage(message.receiver.id);
	}

	async readMessage(socket: Socket, payload: ReadMessageDto): Promise<void> {
		const userId = SocketService.socketToUserId(socket);
		await this.chatService.readMessage(userId, payload.messageId);
	}

	private async sendNotification(notification: Notification): Promise<void> {
		const user = notification.user;
		const sockets = SocketService.connectedUser.get(user.id);
		if (sockets == undefined) return;
		for await (const socketId of sockets) {
			const socket = SocketService.connectedClients.get(socketId);
			socket.emit('notification', notification);
		}
		await SocketService.sendUnreadNotification(user.id);
	}

	static async sendUnreadNotification(userId: number): Promise<void> {
		const notificationService = new NotificationService();
		const sockets = SocketService.connectedUser.get(userId);
		if (sockets == undefined) return;
		const unread =
			await notificationService.getNumberUnreadNotificationByUserId(
				userId,
			);
		for await (const socketId of sockets) {
			const socket = SocketService.connectedClients.get(socketId);
			socket.emit('notificationNotRead', { unread });
		}
	}

	async typping(client: Socket, payload: TyppingDto): Promise<void> {
		const emitterId = SocketService.socketToUserId(client);
		const socketIds = SocketService.connectedUser.get(payload.userId);
		if (socketIds) {
			for await (const socketId of socketIds) {
				const socket = SocketService.connectedClients.get(socketId);
				if (socket) {
					socket.emit('typping', { userId: emitterId });
				}
			}
		}
	}

	private static async onlineStatusMatchChange(
		user: UserService,
	): Promise<void> {
		let page = 0;
		let matchs: UserPublic[] = [];
		const userUpdated = await user.newInstance().getByPK(user.getId());
		do {
			matchs = await user.getMatch(10, page);
			for await (const match of matchs) {
				const socketIds = SocketService.connectedUser.get(match.id);
				if (socketIds === undefined) continue;
				for await (const socketId of socketIds) {
					const socket = SocketService.connectedClients.get(socketId);
					socket.emit('onlineStatusMatch', {
						userId: userUpdated.getId(),
						status: userUpdated.getStatus(),
					});
				}
			}
			page++;
		} while (matchs.length == 10);
	}

	static async sendUnreadMessage(userId: number): Promise<void> {
		const chatService = new ChatService();
		const sockets = SocketService.connectedUser.get(userId);
		if (sockets == undefined) return;
		const data = await chatService.unreadMessage(userId);
		for await (const socketId of sockets) {
			const socket = SocketService.connectedClients.get(socketId);
			socket.emit('unreadMessage', data);
		}
	}
}

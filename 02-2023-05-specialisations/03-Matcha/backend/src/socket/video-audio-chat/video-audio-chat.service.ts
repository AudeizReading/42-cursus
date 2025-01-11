import { UserService } from '$app/user/user.service';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { SocketService } from '../socket.service';
import { AcceptCallDto, SendCallDto } from './video-audio-chat.schema';
import { Socket } from 'socket.io';
import { ICall } from './video-audio-chat.interface';

@Injectable()
export class VideoAudioChatService {
	private static calls: ICall[] = [];

	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		private readonly loggerService: Logger,
	) {
		this.initCall = this.initCall.bind(this);
		this.acceptCall = this.acceptCall.bind(this);
		this.endCall = this.endCall.bind(this);
		this.connect = this.connect.bind(this);
		this.disconnect = this.disconnect.bind(this);

		SocketService.eventEmitter
			.off('emitCall', this.initCall)
			.off('acceptCall', this.acceptCall)
			.off('endCall', this.endCall)
			.off('connect', this.connect)
			.off('disconnect', this.disconnect)
			.on('emitCall', this.initCall)
			.on('acceptCall', this.acceptCall)
			.on('endCall', this.endCall)
			.on('connect', this.connect)
			.on('disconnect', this.disconnect);
	}

	private connect(userId: number): void {
		this.loggerService.log(`Connect ${userId}`, 'VideoAudioChatService');
		const calls = VideoAudioChatService.calls.filter((e) =>
			e.forMe(userId),
		);
		if (calls.length >= 1) {
			this.sendCall(calls[0]);
		}
	}

	private disconnect(userId: number): void {
		this.loggerService.log(`Disconnect ${userId}`, 'VideoAudioChatService');
		this.endCallByUserId(userId);
	}

	private async initCall(socket: Socket, event: SendCallDto): Promise<void> {
		try {
			const emitterUserId = SocketService.socketToUserId(socket);
			const call = new ICall(
				emitterUserId,
				await (
					await this.userService.getByPK(emitterUserId)
				).getPublic(),
				event,
			);
			const authorizedCall = !VideoAudioChatService.calls.some((call) =>
				call.authorized(emitterUserId, event.userId),
			);
			if (authorizedCall) {
				call.timeout = setTimeout(() => {
					this.sendNotAvailable(emitterUserId);
					this.sendNotAvailable(
						call.receiverId,
						"You didn't answer the call",
					);
					this.cleanCall(call);
				}, 30000);
				this.sendCall(call);
				VideoAudioChatService.calls.push(call);
			} else {
				this.sendNotAvailable(emitterUserId);
			}
		} catch (error) {
			this.loggerService.error(`Error in initCall: ${error.message}`);
			socket.emit(
				'error',
				'An error occurred during the call initialization.',
			);
		}
	}

	private endCall(socket: Socket): void {
		const userID = SocketService.socketToUserId(socket);
		this.endCallByUserId(userID);
	}

	private endCallByUserId(userID: number): void {
		const calls = VideoAudioChatService.calls;
		for (let i = 0; i < calls.length; i++) {
			if (calls[i].emitterId == userID || calls[i].receiverId == userID) {
				calls[i].clean();
				this.isEndCall(calls[i]);
				break;
			}
		}
	}

	private isEndCall(call: ICall): void {
		this.cleanCall(call);
		this.sendEndCall(call.receiverId);
		this.sendEndCall(call.emitterId);
	}

	private sendEndCall(userId: number): void {
		const sockets = SocketService.connectedUser.get(userId) ?? [];
		sockets.forEach((socketId) => {
			const socket = SocketService.connectedClients.get(socketId);
			if (socket) {
				socket.emit('endCall');
			}
		});
	}

	private acceptCall(socket: Socket, accept: AcceptCallDto): void {
		const receiveIdUserId = SocketService.socketToUserId(socket);
		const call = VideoAudioChatService.calls.find(
			(e) => e.receiverId == receiveIdUserId,
		);
		if (call) {
			call.clean();
			call.rctIdReceiver = accept.rtcId;
			this.isAccepted(call);
		}
	}

	private isAccepted(call: ICall): void {
		this.sendAcceptCall(call.receiverId, call.rctIdEmitter);
		this.sendAcceptCall(call.emitterId, call.rctIdReceiver);
	}

	private sendAcceptCall(userId: number, rtcId: string): void {
		const sockets = SocketService.connectedUser.get(userId) ?? [];
		sockets.forEach((socketId) => {
			const socket = SocketService.connectedClients.get(socketId);
			if (socket) {
				socket.emit('acceptCall', { rtcId });
			}
		});
	}

	private cleanCall(call: ICall): void {
		VideoAudioChatService.calls = VideoAudioChatService.calls.filter(
			(e) => !e.isMe(call),
		);
	}

	private sendCall(call: ICall): void {
		const sockets = SocketService.connectedUser.get(call.receiverId) ?? [];
		sockets.forEach((socketId) => {
			const socket = SocketService.connectedClients.get(socketId);
			if (socket) {
				socket.emit('call', call.toCall());
			}
		});
	}

	private sendNotAvailable(
		userId: number,
		message: string = 'The user is currently unavailable',
	): void {
		const sockets = SocketService.connectedUser.get(userId) ?? [];
		sockets.forEach((socketId) => {
			const socket = SocketService.connectedClients.get(socketId);
			if (socket) {
				socket.emit('notAvailableCall', { message });
			}
		});
	}
}

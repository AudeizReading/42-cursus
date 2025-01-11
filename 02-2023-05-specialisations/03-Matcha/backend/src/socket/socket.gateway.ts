import {
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import {
	NotificationNotReadRto,
	OnlineUserStatusDto,
	ReadMessageDto,
	SendMessageDto,
	SendMessageRto,
	TyppingDto,
	TyppingRto,
	UnreadMessageDto,
} from './socket.schema';
import { Message } from '$app/chat/chat.schema';
import { ChatService } from '$app/chat/chat.service';
import { Notification } from '$app/notification/notification.schema';
import {
	AcceptCallDto,
	AcceptCallRto,
	EndCall,
	ReceiveCallRto,
	SendCallDto,
	UserNotAvailableRto,
} from './video-audio-chat/video-audio-chat.schema';

@WebSocketGateway({
	pingInterval: 1000,
	pingTimeout: 1000,
	reconnect: false,
	transports: ['websocket'],
})
export class SocketGateway implements OnGatewayConnection {
	@WebSocketServer()
	private server: Socket;

	constructor(
		private readonly loggerService: Logger,
		private readonly socketService: SocketService,
		private readonly chatService: ChatService,
	) {}

	async handleConnection(socket: Socket): Promise<void> {
		await this.socketService.handleConnection(socket);
	}

	async handleDisconnect(socket: Socket): Promise<void> {
		const user = await this.socketService.canActivate(socket);
		if (user != undefined) {
			await this.socketService.disconectedClient(user, socket.id);
		}
		this.loggerService.log(`Disconnect: ${socket.id}`, 'SocketService');
	}

	@AsyncApiPub({
		channel: 'sendMessage',
		message: {
			payload: SendMessageDto,
		},
		description: 'Publish this channel for send message',
	})
	@AsyncApiSub({
		channel: 'sendMessage',
		message: {
			payload: SendMessageRto,
		},
		description:
			'Subscribre this channel for receive responde fron send message',
	})
	@SubscribeMessage('sendMessage')
	async sendMessage(
		client: Socket,
		payload: SendMessageDto,
	): Promise<SendMessageRto> {
		return await this.socketService.sendMessage(client, payload);
	}

	@AsyncApiPub({
		channel: 'readMessage',
		message: {
			payload: ReadMessageDto,
		},
		description: 'Set read message',
	})
	@AsyncApiSub({
		channel: 'readMessage',
		message: {
			payload: Message,
		},
		description:
			'Subscribre this channel for receive responde fron send message',
	})
	@SubscribeMessage('readMessage')
	async readMessage(
		client: Socket,
		payload: ReadMessageDto,
	): Promise<Message> {
		await this.socketService.readMessage(client, payload);
		const msg = await this.chatService.getByPK(payload.messageId);
		return await this.chatService.interfaceToMessage(msg.normalize());
	}

	@AsyncApiSub({
		channel: 'message',
		message: {
			payload: Message,
		},
		description: 'Subscribe this channel for receive message chat',
	})
	message(): void {}

	@AsyncApiSub({
		channel: 'notification',
		message: {
			payload: Notification,
		},
		description:
			"Subscribe this channel for receive notification \
			(type: 'LIKE' | 'UNLIKE' | 'VIEW' | 'MATCH' | 'MESSAGE')",
	})
	notification(): void {}

	@AsyncApiPub({
		channel: 'sendCall',
		message: {
			payload: SendCallDto,
		},
		description: 'Publish for this channel for send call',
	})
	@SubscribeMessage('sendCall')
	sendCall(client: Socket, payload: SendCallDto): void {
		SocketService.eventEmitter.emit('emitCall', client, payload);
	}

	@AsyncApiPub({
		channel: 'acceptCall',
		message: {
			payload: AcceptCallDto,
		},
		description: 'Publish for this channel for accept call',
	})
	@AsyncApiSub({
		channel: 'acceptCall',
		description: 'Subscribe for this channel for receive event call',
		message: {
			payload: AcceptCallRto,
		},
	})
	@SubscribeMessage('acceptCall')
	acceptCall(client: Socket, payload: AcceptCallDto): void {
		SocketService.eventEmitter.emit('acceptCall', client, payload);
	}

	@AsyncApiPub({
		channel: 'endCall',
		description: 'Publish for this channel: end or refuse call',
		message: {
			payload: EndCall,
		},
	})
	@AsyncApiSub({
		channel: 'endCall',
		description:
			'Subscribre for this channel for receive call is end (User end call or disconnect)',
		message: {
			payload: EndCall,
		},
	})
	@SubscribeMessage('endCall')
	endCall(client: Socket): void {
		SocketService.eventEmitter.emit('endCall', client);
	}

	@AsyncApiSub({
		channel: 'call',
		description: 'Subscribe for this channel for receive event call',
		message: {
			payload: ReceiveCallRto,
		},
	})
	call(): void {}

	@AsyncApiSub({
		channel: 'notAvailableCall',
		description:
			'Subscribe for this channel for receive not available event call',
		message: {
			payload: UserNotAvailableRto,
		},
	})
	notAvailable(): void {}

	@AsyncApiPub({
		channel: 'typping',
		message: {
			payload: TyppingDto,
		},
		description: 'Emmite event writting',
	})
	@AsyncApiSub({
		channel: 'typping',
		message: {
			payload: TyppingRto,
		},
		description: 'Get if match writting',
	})
	@SubscribeMessage('typping')
	async typping(client: Socket, payload: TyppingDto): Promise<void> {
		await this.socketService.typping(client, payload);
	}

	@AsyncApiSub({
		channel: 'notificationNotRead',
		message: { payload: NotificationNotReadRto },
		description: 'Receive number notification unread',
	})
	notificationNotRead(): void {}

	@AsyncApiSub({
		channel: 'onlineStatusMatch',
		message: { payload: OnlineUserStatusDto },
		description:
			'Event received when switch online to offline and vice-versa',
	})
	onlineStatusMatch(): void {}

	@AsyncApiSub({
		channel: 'unreadMessage',
		message: { payload: UnreadMessageDto },
		description: 'Receive number message unread',
	})
	unreadMessage(): void {}
}

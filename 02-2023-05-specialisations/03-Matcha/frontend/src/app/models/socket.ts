import { ChatConversationAPIResponseDTO, NotificationResponseDTO, NotificationType, ProfileDTO } from '.';

// pub sendMessage
export interface SendMessageDTO {
	userId: number;
	message: string;
}

// sub sendMessage
export interface SendMessageRTO {
	status: boolean;
}

// pub readMessage
export interface ReadMessageDTO {
	messageId: number;
}

// sub readMessage
export interface ReadMessageRTO extends ChatConversationAPIResponseDTO {}

// sub unreadMessage
export interface UnReadMessageRTO {
	unreadMessages: {
		userId: number;
		number: number;
	}[];
	total: number;
}

// sub onlineStatusMatch
export interface OnlineStatusMatchRTO {
	userId: number;
	status: string;
}

// sub message
export interface MessageRTO extends ReadMessageRTO {}

// sub notification
export interface NotificationRTO {
	id: number;
	user: ProfileDTO | null;
	fromUser: ProfileDTO | null;
	type: NotificationType | null;
	message: MessageRTO | null;
	createdAt: string;
	read: boolean;
}

export interface NbNotificationsRTO {
	unread: number;
}

export type CallType = 'VIDEO' | 'AUDIO';
// pub sendCall
export interface SendCallDTO {
	rtcId: string;
	userId: number;
	type: CallType;
}
// pub acceptCall
export interface AcceptCallDTO extends Pick<SendCallDTO, 'rtcId'> {}
// sub acceptCall
export interface AcceptCallRTO extends AcceptCallDTO {}
// pub endCall
export interface EndCallDTO {}
// sub endCall
export interface EndCallRTO extends EndCallDTO {}
// sub call
export interface ReceiveCallRTO extends Pick<SendCallDTO, 'type'> {
	user: ProfileDTO | null;
}
// sub notAvailableCall
export interface NotAvailableCallRTO {
	message: string;
}

// pub typping
export interface TyppingDTO {
	userId: number;
}
// sub typping
export interface TyppingRTO extends TyppingDTO {}

type EventMapPub = {
	sendMessage: SendMessageDTO;
	readMessage: ReadMessageDTO;
	sendCall: SendCallDTO;
	acceptCall: AcceptCallDTO;
	endCall: EndCallDTO;
	typping: TyppingDTO;
};

type EventMapSub = {
	sendMessage: SendMessageRTO;
	readMessage: ReadMessageRTO;
	message: ReadMessageRTO;
	notification: NotificationRTO;
	acceptCall: AcceptCallRTO;
	endCall: EndCallRTO;
	call: ReceiveCallRTO;
	notAvailableCall: NotAvailableCallRTO;
	typping: TyppingRTO;
	notificationNotRead: NbNotificationsRTO;
	onlineStatusMatch: OnlineStatusMatchRTO;
	unreadMessage: UnReadMessageRTO;
};
export type SocketEventPub = keyof EventMapPub;
export type SocketEventSub = keyof EventMapSub;
export type PayloadPub = SendMessageDTO | ReadMessageDTO | SendCallDTO | AcceptCallDTO | EndCallDTO | TyppingDTO;
export type PayloadSub =
	| SendMessageRTO
	| ReadMessageRTO
	| NotificationRTO
	| AcceptCallRTO
	| EndCallRTO
	| ReceiveCallRTO
	| NotAvailableCallRTO
	| UnReadMessageRTO
	| NbNotificationsRTO
	| OnlineStatusMatchRTO
	| NotificationResponseDTO
	| TyppingRTO;

export interface SocketEventPayload<TEvent extends SocketEventPub | SocketEventSub> {
	event: TEvent;
	payload: TEvent extends SocketEventPub
		? EventMapPub[TEvent]
		: TEvent extends SocketEventSub
			? EventMapSub[TEvent]
			: never;
}

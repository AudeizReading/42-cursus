export type EventType =
	| 'LIKE'
	| 'UNLIKE'
	| 'VIEW'
	| 'MATCH'
	| 'MESSAGE'
	| 'EVENT_ACCEPTED'
	| 'EVENT_REFUSE'
	| 'NEW_EVENT';

interface INotificationType<D, T, E> {
	id: number;
	userId: number;
	fromUserId: number;
	type: E;
	messageId?: number;
	createdAt: D;
	read: T;
}

export type IDatabaseNotification = INotificationType<number, number, string>;
export type INotification = INotificationType<Date, boolean, EventType>;

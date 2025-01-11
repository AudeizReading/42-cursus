export type EventType = 'WAITING' | 'ACCEPTED' | 'REFUSE';

interface IEventType<T, D> {
	id: number;
	latitude: number;
	longitude: number;
	userId: number;
	matchId: number;
	datetime: D;
	name: string;
	description: string;
	fileId?: number;
	status: T;
}

export type IEvent = IEventType<EventType, Date>;
export type IDatabaseEvent = IEventType<string, number>;

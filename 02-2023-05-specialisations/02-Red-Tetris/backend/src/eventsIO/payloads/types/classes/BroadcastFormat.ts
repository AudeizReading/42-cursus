import { IBrodacastFormat, OAPM } from '../IPayload';

class BrodcastFormat implements IBrodacastFormat {
	public event: keyof OAPM;
	public data: OAPM[keyof OAPM];
	public sid?: string;
	public room?: string;
	protected constructor(event: keyof OAPM, data: OAPM[keyof OAPM], sid?: string, room?: string) {
		this.event = event;
		this.data = data;
		this.sid = sid;
		this.room = room;
	}

	public static createPayload<T extends keyof OAPM>(
		event: T,
		data: OAPM[T],
		sid?: string,
		room?: string,
	): IBrodacastFormat {
		return new BrodcastFormat(event, data, sid, room);
	}
}

export { BrodcastFormat };

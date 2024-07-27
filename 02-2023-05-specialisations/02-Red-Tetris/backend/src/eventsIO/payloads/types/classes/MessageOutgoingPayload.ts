import { IMOP, IPlayerJSON, IRoomJSON } from '../IPayload';

class MessageOutgoingPayload implements IMOP {
	protected constructor(
		public message: string,
		public date: Date,
		public emitter: IPlayerJSON,
		public receiver: IPlayerJSON | IRoomJSON | undefined,
	) {
		this.message = message;
		this.date = date;
		this.emitter = emitter;
		this.receiver = receiver;
	}

	public static createPayload(
		message: string,
		date: Date,
		emitter: IPlayerJSON,
		receiver: IPlayerJSON | IRoomJSON | undefined,
	): MessageOutgoingPayload {
		return new MessageOutgoingPayload(message, date, emitter, receiver);
	}
}

type MOP = MessageOutgoingPayload;

export { MessageOutgoingPayload, MOP };

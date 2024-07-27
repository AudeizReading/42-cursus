import { IMIP } from '../IPayload';

class MessageIncomingPayload implements IMIP {
	protected constructor(
		public message: string,
		public receiver: string,
	) {
		this.message = message;
		this.receiver = receiver;
	}

	public static createPayload(message: string, receiver: string): MessageIncomingPayload {
		return new MessageIncomingPayload(message, receiver);
	}
}

type MIP = MessageIncomingPayload;

export { MessageIncomingPayload, MIP };

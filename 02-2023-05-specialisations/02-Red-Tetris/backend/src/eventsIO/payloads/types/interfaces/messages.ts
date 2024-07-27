import { ICltToSrvPayload, ISrvToCltPayload } from './base';
import { IPlayerJSON } from './players';

interface IMessage {
	message: string;
}

interface ISrvToCltMessage extends ISrvToCltPayload, IMessage {}

interface ICltToSrvMessage extends ICltToSrvPayload, IMessage {}

interface IMessageOutgoingPayload extends ISrvToCltMessage {
	date: Date;
	emitter: IPlayerJSON;
	receiver: ISrvToCltPayload | undefined;
}

interface IMessageIncomingPayload extends ICltToSrvMessage {
	receiver: string; // session id of the player or name of the room
}

type IMIP = IMessageIncomingPayload;
type IMOP = IMessageOutgoingPayload;

export { IMIP, IMOP };

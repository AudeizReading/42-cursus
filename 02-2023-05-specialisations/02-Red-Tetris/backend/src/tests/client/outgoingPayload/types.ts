import {
	IPlayerJSON,
	IRoomJSON,
	IPlayerPayload,
	IRoomPayload,
	IGameStartPayload,
	IMOP,
} from '../../../eventsIO/payloads/types/IPayload';
import { IncomingActionPayloadMap } from '../incomingPayload/types';

type OutgoingActionPayloadMap = {
	join: IPlayerJSON;
	playerChange: IPlayerPayload;
	getRooms: IRoomJSON[];
	getRoomsPlayer: IRoomJSON[];
	roomChange: IRoomPayload;
	roomOpened: IRoomPayload;
	roomClosed: IRoomPayload;
	roomInfo: IRoomJSON;
	message: IMOP;
	error: string;
	gameStart: IGameStartPayload;
};

type OAPM = OutgoingActionPayloadMap;
type OEvent = keyof OAPM;
type OPayload<T extends OEvent> = T extends OEvent ? OAPM[T] : never;

type OutgoingAction<T extends OEvent> = {
	event: T;
	payload: OPayload<T> | OutgoingActionPayloadMap[T];
};

/* abstraction du callaback a utiliser dans l'event écouté
 * ex: OutgoingActionCallback['join] => (payload: OutgoingActionPayloadMap['join']) => void
 * ce qui "traduit", donne: IPlayerJSON => (payload: IPlayerJSON) => void
 */
type OutgoingActionCallback<T extends OEvent> = (payload: OPayload<T>) => void;

type OutgoingHandlerData<T extends OEvent> = {
	resolve: (payload: OPayload<T> | PromiseLike<OPayload<T>>) => void;
	sessionId?: string;
	data?: IncomingActionPayloadMap[keyof IncomingActionPayloadMap];
};

type OutgoingPayloadFactory<T extends OEvent> = (
	settings: Partial<OPayload<T> | OutgoingActionPayloadMap[T]>,
) => OPayload<T> | OutgoingActionPayloadMap[T];

export {
	OutgoingActionPayloadMap,
	OAPM,
	OEvent,
	OPayload,
	OutgoingAction,
	OutgoingActionCallback,
	OutgoingHandlerData,
	OutgoingPayloadFactory,
};

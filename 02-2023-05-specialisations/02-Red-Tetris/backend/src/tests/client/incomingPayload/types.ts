import { IMIP } from '../../../eventsIO/payloads/types/IPayload';

type IncomingActionPayloadMap = {
	error: string;
	message: IMIP;
	ready: string;
	createRoom: string;
	joinRoom: string;
	leaveRoom: string;
	gameStart: string;
	getRooms: never;
	changeUsername: string;
	getRoom: string;
	getRoomsPlayer: never;
	undefined: undefined;
};

type IncomingAction<T extends keyof IncomingActionPayloadMap> = {
	event: T;
	payload: IncomingActionPayloadMap[T];
};

export { IncomingActionPayloadMap, IncomingAction };

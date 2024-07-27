import {
	OAPM, //OutgoingActionPayloadMap
	OutgoingActionCallback,
	OutgoingHandlerData,
} from './types';

// id unique du client
let sessionId: string;
const outgoingJoinHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['join']>payload).sessionID !== data.sessionId) {
			sessionId = (<OAPM['join']>payload).sessionID;
			data.resolve(payload);
		}
	};

const outgoingPlayerChangeHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['playerChange']>payload).player.sessionID === data.sessionId) {
			data.resolve(payload);
		}
	};
const outgoingPlayerChangeRejectHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['playerChange']>payload).player.sessionID !== data.sessionId) {
			data.resolve(payload);
		}
	};

const outgoingRoomOpenedHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['roomOpened']>payload).room.name === data.data) {
			data.resolve(payload);
		}
	};

const outgoingRoomChangeHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['roomChange']>payload).room.name === data.data) {
			data.resolve(payload);
		}
	};

const outgoingRoomChangeRejectHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['roomChange']>payload).room.name !== data.data) {
			data.resolve(payload);
		}
	};

const outgoingRoomOpenedRejectHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['roomOpened']>payload).room.name !== data.data) {
			data.resolve(payload);
		}
	};
const outgoingRoomClosedRejectHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['roomClosed']>payload).room.name !== data.data) {
			data.resolve(payload);
		}
	};

const outgoingRoomCloseHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['roomClosed']>payload).room.name === data.data) {
			data.resolve(payload);
		}
	};

const outgoingGameStartHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['gameStart']>payload).roomName === data.data) {
			data.resolve(payload);
		}
	};

const outgoingGameStartRejectHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		if ((<OAPM['gameStart']>payload).roomName !== data.data) {
			data.resolve(payload);
		}
	};

const outgoingBasicHandler =
	<T extends keyof OAPM>(data: OutgoingHandlerData<T>): OutgoingActionCallback<T> =>
	(payload) => {
		data.resolve(payload);
	};

export {
	outgoingJoinHandler,
	outgoingPlayerChangeHandler,
	outgoingRoomChangeHandler,
	outgoingRoomCloseHandler,
	outgoingBasicHandler,
	outgoingRoomOpenedHandler,
	sessionId,
	outgoingGameStartHandler,
	outgoingPlayerChangeRejectHandler,
	outgoingRoomChangeRejectHandler,
	outgoingRoomOpenedRejectHandler,
	outgoingRoomClosedRejectHandler,
	outgoingGameStartRejectHandler,
};

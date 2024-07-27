import {
	IPlayerJSON,
	IRoomJSON,
	IRoomState,
	Socket,
	createIncomingAction,
	createOutgoingAction,
	sessionId,
	testOutgoingEventWithIncomingAct,
} from '..';

export async function sendMessageToOneRoom(data: {
	client: Socket;
	username: string;
	roomName: string;
	roomName2: string;
	playerExpect: IPlayerJSON;
	roomExpect: IRoomJSON;
	roomsState: IRoomState[];
}): Promise<void> {
	const { client, roomName, roomName2, playerExpect, roomExpect, username, roomsState } = data;
	const player = {
		...playerExpect,
		username: username,
		sessionID: sessionId,
		leads: [roomName, roomName2],
		roomsState,
	};
	const room = {
		...roomExpect,
		name: roomName,
		players: [player],
		totalPlayers: 1,
		leader: player,
		games: [],
	};
	await testOutgoingEventWithIncomingAct({
		client,
		toSend: createIncomingAction('message', {
			message: 'Hello Room!',
			receiver: roomName,
		}),
		expected: createOutgoingAction('message', {
			date: expect.any(String) as unknown as Date,
			message: 'Hello Room!',
			emitter: player,
			receiver: room,
		}),
	});
}

export async function sendMessageToSelf(data: {
	client: Socket;
	username: string;
	roomName: string;
	roomName2: string;
	playerExpect: IPlayerJSON;
	roomsState: IRoomState[];
}): Promise<void> {
	const { client, roomName, roomName2, playerExpect, username, roomsState } = data;
	const player = {
		...playerExpect,
		username: username,
		sessionID: sessionId,
		leads: [roomName, roomName2],
		roomsState,
	};
	await testOutgoingEventWithIncomingAct({
		client,
		toSend: createIncomingAction('message', {
			message: 'Hello Self!',
			receiver: player.sessionID,
		}),
		expected: createOutgoingAction('message', {
			date: expect.any(String) as unknown as Date,
			message: 'Hello Self!',
			emitter: player,
			receiver: player,
		}),
	});
}

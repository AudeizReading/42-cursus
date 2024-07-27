import {
	IPlayerJSON,
	IRoomJSON,
	IRoomState,
	Socket,
	createIncomingAction,
	createOutgoingAction,
	createRoomState,
	sessionId,
	testOutgoingEventWithIncomingAct,
} from '..';

export async function getRoomsWithTwoRoomsCreated(data: {
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

	const room2 = {
		...roomExpect,
		name: roomName2,
		players: [],
		totalPlayers: 0,
		leader: player,
		games: [],
	};

	await testOutgoingEventWithIncomingAct({
		client,
		toSend: createIncomingAction('getRooms', undefined as never),
		expected: createOutgoingAction('getRooms', [room, room2]),
	});
}

export async function getRoomsPlayerWithTwoRoomsCreated(data: {
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
		toSend: createIncomingAction('getRoomsPlayer', undefined as never),
		expected: createOutgoingAction('getRoomsPlayer', [room]),
	});
}

export async function getRoomInfo(data: {
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
		toSend: createIncomingAction('getRoom', roomName),
		expected: createOutgoingAction('roomInfo', room),
	});
}

export async function getRoomsAfterLeavingFirstJoined(data: {
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
		roomsState: [
			...roomsState,
			createRoomState({
				name: roomName2,
				status: 'active',
			}),
		],
	};

	await testOutgoingEventWithIncomingAct({
		client,
		toSend: createIncomingAction('getRooms', undefined as never),
		expected: createOutgoingAction('getRooms', [
			{
				...roomExpect,
				name: roomName2,
				players: [player],
				totalPlayers: 1,
				leader: player,
				games: [],
			},
		]),
	});
}

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

export async function joinRoomToBePlayerIncoming(data: {
	client: Socket;
	roomName: string;
	playerExpect: IPlayerJSON;
	roomExpect: IRoomJSON;
	roomsState: IRoomState[];
}): Promise<void> {
	const { client, roomName, playerExpect, roomExpect, roomsState } = data;
	const player = {
		...playerExpect,
		sessionID: sessionId,
		leads: [roomName],
		roomsState,
	};

	await testOutgoingEventWithIncomingAct({
		client,
		toSend: createIncomingAction('joinRoom', roomName),
		expected: createOutgoingAction('roomChange', {
			reason: 'player incoming',
			room: {
				...roomExpect,
				name: roomName,
				players: [player],
				totalPlayers: 1,
				leader: player,
				games: [],
			},
			player,
		}),
	});
}

export async function joinRoomWithLeadingTwoRoomsUnjoined(data: {
	client: Socket;
	roomName: string;
	roomName2: string;
	playerExpect: IPlayerJSON;
	roomExpect: IRoomJSON;
	roomsState: IRoomState[];
}): Promise<void> {
	const { client, roomName, roomName2, playerExpect, roomExpect, roomsState } = data;

	roomExpect.name = roomName;
	const player = {
		...playerExpect,
		sessionID: sessionId,
		leads: [roomName, roomName2],
		roomsState,
	};
	roomExpect.leader = player;
	roomExpect.players = [player];
	roomExpect.totalPlayers = 1;

	await testOutgoingEventWithIncomingAct({
		client,
		toSend: createIncomingAction('joinRoom', roomName),
		expected: createOutgoingAction('roomChange', {
			reason: 'player incoming',
			room: {
				...roomExpect,
				games: [],
			},
			player,
		}),
	});
}

export async function joinTheSecondRoomWithLeadingTwoRooms(data: {
	client: Socket;
	username: string;
	roomName: string;
	roomName2: string;
	playerExpect: IPlayerJSON;
	roomExpect: IRoomJSON;
	roomsState: IRoomState[];
}): Promise<void> {
	const { client, roomName, roomName2, username, playerExpect, roomExpect, roomsState } = data;
	const player = {
		...playerExpect,
		sessionID: sessionId,
		username: username,
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
		toSend: createIncomingAction('joinRoom', roomName2),
		expected: createOutgoingAction('roomChange', {
			reason: 'player incoming',
			room: {
				...roomExpect,
				name: roomName2,
				players: [player],
				totalPlayers: 1,
				leader: player,
				games: [],
			},
			player,
		}),
	});
}

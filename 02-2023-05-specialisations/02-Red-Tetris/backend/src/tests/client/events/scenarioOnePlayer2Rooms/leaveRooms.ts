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

export async function leaveFirstRoomJoined(data: {
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
		sessionID: sessionId,
		leads: [roomName, roomName2],
		username: username,
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
		toSend: createIncomingAction('leaveRoom', roomName),
		expected: createOutgoingAction('roomClosed', {
			room: {
				...roomExpect,
				name: roomName,
				leader: player,
				games: [],
				totalPlayers: 0,
				players: [],
			},
			player,
		}),
	});
}

export async function leaveSecondRoomJoined(data: {
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
		sessionID: sessionId,
		leads: [roomName, roomName2],
		username: username,
		roomsState: [
			...roomsState,
			createRoomState({
				name: roomName2,
				status: 'left',
			}),
		],
	};
	await testOutgoingEventWithIncomingAct({
		client,
		toSend: createIncomingAction('leaveRoom', roomName2),
		expected: createOutgoingAction('roomChange', {
			reason: 'player outgoing',
			room: {
				...roomExpect,
				name: roomName2,
				leader: player,
				totalPlayers: 0,
				players: [],
				games: [],
			},
			player,
		}),
	});
}

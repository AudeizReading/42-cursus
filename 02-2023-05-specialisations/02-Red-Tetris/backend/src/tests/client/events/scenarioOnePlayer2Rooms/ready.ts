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

export async function setAsReadyIntoOneRoomThenCheckRoomInfo(data: {
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
		roomsState,
	};
	await testOutgoingEventWithIncomingAct({
		client,
		toSend: createIncomingAction('ready', roomName),
		expected: createOutgoingAction('playerChange', {
			reason: 'ready',
			player,
		}),
	});

	await testOutgoingEventWithIncomingAct({
		client,
		toSend: createIncomingAction('getRoom', roomName),
		expected: createOutgoingAction('roomInfo', {
			...roomExpect,
			name: roomName,
			leader: player,
			players: [player],
			totalPlayers: 1,
			readys: [player],
			totalReady: 1,
			games: [],
		}),
	});
}

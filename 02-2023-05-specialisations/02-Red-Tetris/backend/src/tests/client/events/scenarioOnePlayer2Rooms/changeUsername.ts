import {
	IPlayerJSON,
	IRoomState,
	Socket,
	createIncomingAction,
	createOutgoingAction,
	sessionId,
	testOutgoingEventWithIncomingAct,
} from '..';

export async function changeUsername(data: {
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
		toSend: createIncomingAction('changeUsername', username),
		expected: createOutgoingAction('playerChange', {
			reason: 'change username',
			player,
		}),
	});
}

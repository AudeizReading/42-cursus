import {
	IPlayerJSON,
	Socket,
	createClient,
	createIncomingAction,
	createOutgoingAction,
	sessionId,
	testOutgoingEventWithIncomingAct,
} from '..';

type IPJ = IPlayerJSON;
export async function joinServerEvent(username: string, playerExpect: IPJ): Promise<Socket> {
	const client = createClient({ username });
	await testOutgoingEventWithIncomingAct({
		client,
		toSend: createIncomingAction('undefined', undefined),
		expected: createOutgoingAction('join', {
			...playerExpect,
			sessionID: sessionId,
		}),
	});
	return client;
}

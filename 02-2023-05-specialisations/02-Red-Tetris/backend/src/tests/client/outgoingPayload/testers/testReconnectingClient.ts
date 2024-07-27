import { OAPM, OutgoingAction } from '..';
import { Socket } from 'socket.io-client';
import { reconnectClient } from '../listeners';
import { validateOutgoingPayload } from '../validators';

export async function testReconnectingClient<T extends keyof OAPM>(data: {
	client: Socket;
	expected: OutgoingAction<T>;
}): Promise<void> {
	await validateOutgoingPayload<T>(
		data.client,
		reconnectClient(data.client, (<OAPM['join']>data.expected.payload).username),
		data.expected,
	);
}

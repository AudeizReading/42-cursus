import { Socket } from 'socket.io-client';
import { OAPM, OutgoingAction } from '..';
import { validateSeveralPayloads } from '../validators';
import { duplicateClient } from '../listeners';

export async function testDuplicateClient<T extends keyof OAPM>(
	config: {
		client: Socket;
		username: string;
		nbDuplicate: number;
	},
	expected: Array<OutgoingAction<T>>,
): Promise<void> {
	await validateSeveralPayloads(
		config.client,
		duplicateClient(config.client, config.username, config.nbDuplicate),
		expected,
	);
}

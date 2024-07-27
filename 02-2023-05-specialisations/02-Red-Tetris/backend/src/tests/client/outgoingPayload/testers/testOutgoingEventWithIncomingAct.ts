import { IncomingActionPayloadMap as IAPM, IncomingAction } from '../../incomingPayload/types';
import { OAPM, OutgoingAction } from '..';
import { Socket } from 'socket.io-client';
import { listenOutgoingEvent } from '../listeners';
import { validateOutgoingPayload } from '../validators';

export async function testOutgoingEventWithIncomingAct<T extends keyof OAPM, U extends keyof IAPM>(data: {
	client: Socket;
	toSend: IncomingAction<U>;
	expected: OutgoingAction<T>;
}): Promise<void> {
	await validateOutgoingPayload<T>(
		data.client,
		listenOutgoingEvent<T, U>(data.client, data.expected.event, data.toSend),
		data.expected,
	);
}

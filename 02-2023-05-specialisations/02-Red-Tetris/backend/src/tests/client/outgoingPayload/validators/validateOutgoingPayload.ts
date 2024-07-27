import { Socket } from 'socket.io-client';
import { OAPM, OEvent, OPayload, OutgoingAction } from '..';
import { isTypeOfUndefined } from '../../../../base/typeGuards';

import { expect } from '@jest/globals';

export async function validateOutgoingPayload<T extends keyof OAPM>(
	client: Socket,
	promise: Promise<OAPM[T] | OPayload<OEvent>>,
	expected: OutgoingAction<T>,
): Promise<void> {
	return await promise
		.then((data: OAPM[T] | OPayload<OEvent>) => {
			if (!isTypeOfUndefined(data)) {
				if (
					expected.event === 'join' &&
					!(<OAPM['join']>expected.payload).sessionID &&
					(<OAPM['join']>data).username === (<OAPM['join']>expected.payload).username
				) {
					const payload = {
						...(<OAPM['join']>expected.payload),
						sessionID: (<OAPM['join']>data).sessionID,
					};
					expect(data).toBeOutgoingPayload(payload);
				} else {
					expect(data).toBeOutgoingPayload(expected.payload);
				}
			}
		})
		.finally(() => {
			client.off(expected.event);
			client.off('error');
		});
}

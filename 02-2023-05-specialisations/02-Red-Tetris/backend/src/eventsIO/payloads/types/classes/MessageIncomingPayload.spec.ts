import { MessageIncomingPayload } from './MessageIncomingPayload';
import { expect, describe, test } from '@jest/globals';

describe('MessageIncomingPayload', () => {
	test('should create a payload with message and receiver', () => {
		const message = 'Hello';
		const receiver = 'World';
		const payload = MessageIncomingPayload.createPayload(message, receiver);
		expect(payload.message).toBe(message);
		expect(payload.receiver).toBe(receiver);
	});
});

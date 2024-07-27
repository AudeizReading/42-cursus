import { IncomingActionPayloadMap, IncomingAction } from './types';

function createIncomingAction<T extends keyof IncomingActionPayloadMap>(
	event: T,
	payload: IncomingActionPayloadMap[T],
): IncomingAction<T> {
	return { event, payload };
}

export { createIncomingAction };

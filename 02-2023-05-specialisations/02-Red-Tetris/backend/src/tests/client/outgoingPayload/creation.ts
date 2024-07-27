import { createOutgoingPayloadFactory } from './factory';
import { OAPM, OPayload, OutgoingAction } from './types';

function createOutgoingPayload<T extends keyof OAPM>(settings: Partial<OAPM[T] | OPayload<T>>): OAPM[T] | OPayload<T> {
	return createOutgoingPayloadFactory<T>()(settings);
}

function createOutgoingAction<T extends keyof OAPM>(event: T, payload: OAPM[T]): OutgoingAction<T> {
	return { event, payload: createOutgoingPayload<T>(payload) };
}

export { createOutgoingPayload, createOutgoingAction };

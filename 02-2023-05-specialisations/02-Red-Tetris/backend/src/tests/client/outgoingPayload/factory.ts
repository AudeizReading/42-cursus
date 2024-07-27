import { OAPM, OPayload, OutgoingPayloadFactory } from './types';

function createOutgoingPayloadFactory<T extends keyof OAPM>(): OutgoingPayloadFactory<T> {
	return (settings: Partial<OAPM[T] | OPayload<T>>): OAPM[T] | OPayload<T> => {
		if (typeof settings === 'string') {
			return settings;
		} else if (Array.isArray(settings)) {
			return [...settings] as OAPM[T];
		}
		return { ...settings } as unknown as OPayload<T>;
	};
}

export { createOutgoingPayloadFactory };

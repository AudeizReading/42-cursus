import { Socket } from 'socket.io-client';
import { listenSeveralEvents } from '../listeners';
import { IncomingActionPayloadMap as IAPM, IncomingAction } from '../../incomingPayload/types';
import { OEvent, OPayload, OutgoingAction } from '..';
import { validateSeveralPayloads } from '../validators';
import { OEventTimes, listenSeveralEventsSeveralTimes } from '../listeners/listenSeveralEventsSeveralTimes';

export async function testSeveralOutgoingEvents<U extends keyof IAPM>(
	client: Socket,
	toSend: IncomingAction<U>,
	expected: Array<OutgoingAction<OEvent>>,
	config?: {
		name: string;
		toWatch: string[];
	},
): Promise<void> {
	const events = expected.map((ex) => {
		return ex.event;
	});
	return await validateSeveralPayloads(
		client,
		listenSeveralEvents<U>(client, events, toSend, config),
		expected,
		config,
	);
}

type Expected = {
	event: OEvent;
	times: number;
	payloads: Array<OPayload<OEvent>>;
};
export async function testSeveralOutgoingEventsSeveralTimes<U extends keyof IAPM>(
	client: Socket,
	toSend: IncomingAction<U>,
	expected: Array<Expected>,
	config?: {
		name: string;
		toWatch: string[];
	},
): Promise<void> {
	const events = expected.reduce((acc, ex) => {
		const { event, times } = ex;
		return { ...acc, [event]: times };
	}, {} as OEventTimes);
	const payloads = expected
		.map((ex) => {
			return ex.payloads.map((p) => {
				return { event: ex.event, payload: p };
			});
		})
		.flat();
	return await validateSeveralPayloads(
		client,
		listenSeveralEventsSeveralTimes<U>(client, events, toSend, config),
		payloads,
		config,
	);
}

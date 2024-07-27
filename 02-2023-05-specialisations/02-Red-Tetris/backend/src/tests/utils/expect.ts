import { expect } from '@jest/globals';
import type { MatcherFunction as MF } from 'expect';
import { diff } from 'jest-diff';

import { IPlayerJSON, IRoomJSON, IRoomPayload } from '../../eventsIO/payloads/types/IPayload';
import { IPlayerPayload } from '../../eventsIO/payloads/types/IPayload';

import { Validator } from '../../base/typeGuards';
import {
	isRoom,
	isPlayer,
	isPlayerPayload,
	isRoomPayload,
	isOutgoingPayload,
	isLeaderBoardResult,
} from '../client/outgoingPayload/typeGuard/validation';
import { OAPM } from 'tests/client/outgoingPayload/types';
import { LeaderBoardResult } from '../../infra/leaderboard/leaderBoardService';

function createMatcher<T>(validator: Validator<T>): MF<[T]> {
	return function (received: unknown, expected: T) {
		if (!validator(received) || !validator(expected)) {
			throw new Error(`Matcher expects an object of type ${validator.name}`);
		}
		const pass = this.equals(received, expected);
		const printExp = `\x1b[32m${this.utils.printExpected(expected)}\x1b[0m`;
		const printRec = `\x1b[33m${this.utils.printReceived(received)}\x1b[0m`;

		const msgExp = `Expected: ${pass ? 'not' : ''} ${printExp}\n`;
		const msgRec = `Received: ${printRec}\n`;
		const matcher = `${this.utils.matcherHint(`${validator.name}`)}\n\n${msgExp}${msgRec}`;
		const message = pass
			? (): string => {
					return matcher;
				}
			: (): string => {
					const regex = /(\+(?:[\s\S\w\W])+,{1})/g;
					const strRepl = `\x1b[31m$1\x1b[0m`;
					const diffStr = diff(expected, received)?.replace(regex, strRepl);
					return matcher + '\n\n' + diffStr;
				};
		return { actual: received, expected, message, pass };
	};
}

const toBeRoom = createMatcher<IRoomJSON>(isRoom);
const toBePlayer = createMatcher<IPlayerJSON>(isPlayer);
const toBePlayerPayload = createMatcher<IPlayerPayload>(isPlayerPayload);
const toBeRoomPayload = createMatcher<IRoomPayload>(isRoomPayload);
const toBeOutgoingPayload = createMatcher<OAPM[keyof OAPM]>(isOutgoingPayload);
const toBeLeaderBoardResult = createMatcher<LeaderBoardResult>(isLeaderBoardResult);

expect.extend({
	toBeRoom,
	toBePlayer,
	toBeRoomPayload,
	toBePlayerPayload,
	toBeOutgoingPayload,
	toBeLeaderBoardResult,
});

declare module 'expect' {
	interface Matchers<R> {
		toBeRoom(room: IRoomJSON | undefined): R;
		toBePlayer(player: IPlayerJSON | undefined): R;
		toBePlayerPayload(data: IPlayerPayload | undefined): R;
		toBeRoomPayload(data: IRoomPayload | undefined): R;
		toBeOutgoingPayload(payload: OAPM[keyof OAPM]): R;
		toBeLeaderBoardResult(result: LeaderBoardResult): R;
	}
	interface AsymmetricMatchers {
		toBeRoom(room: IRoomJSON | undefined): void;
		toBePlayer(player: IPlayerJSON | undefined): void;
		toBePlayerPayload(data: IPlayerPayload | undefined): void;
		toBeRoomPayload(data: IRoomPayload | undefined): void;
		toBeOutgoingPayload(payload: OAPM[keyof OAPM]): void;
		toBeLeaderBoardResult(result: LeaderBoardResult): void;
	}
}

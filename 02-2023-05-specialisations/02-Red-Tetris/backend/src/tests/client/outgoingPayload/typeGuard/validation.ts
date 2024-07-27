import { IRoomPayload, IRoomJSON, IGameStartPayload, IMOP } from '../../../../eventsIO/payloads/types/IPayload';
import { IPlayerPayload } from '../../../../eventsIO/payloads/types/IPayload';

import { Validator, isTypeOfUndefined } from '../../../../base/typeGuards';
import { isPlayer } from '../../../player/utils/typeGuard/validation';
import { isRoom, isArrayOfRooms } from '../../../room/typeGuard/validation';
import { OAPM } from '../types';
import { LeaderBoardResult } from '../../../../infra/leaderboard/leaderBoardService';

type IGSP = IGameStartPayload;

const isPlayerPayload: Validator<IPlayerPayload> = (value): value is IPlayerPayload => {
	if (typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const _value = value as IPlayerPayload;
	return 'reason' in _value ? 'reason' in _value && isPlayer(_value['player']) : isPlayer(_value);
};

const isRoomPayload: Validator<IRoomPayload> = (value): value is IRoomPayload => {
	if (typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const _value = value as IRoomPayload;
	return 'reason' in _value
		? isPlayerPayload(_value['player']) && isRoom(_value['room'])
		: isRoom(_value['room']) || isRoom(_value);
};

const isRoomArrayPayload: Validator<IRoomJSON[]> = (value): value is IRoomJSON[] => {
	if (!Array.isArray(value)) {
		return false;
	}
	return isArrayOfRooms(value);
};

const isIMessageOutgoingPayload: Validator<IMOP> = (value): value is IMOP => {
	if (typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const _value = value as IMOP;
	return (
		'date' in _value &&
		'message' in _value &&
		'emitter' in _value &&
		'receiver' in _value &&
		isPlayer(_value['emitter']) &&
		(isPlayer(_value.receiver) || isRoom(_value.receiver) || isTypeOfUndefined(_value.receiver))
	);
};

const isIGameStartPayload: Validator<IGSP> = (value): value is IGSP => {
	if (typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const _value = value as IGSP;
	return 'roomName' in _value && 'reason' in _value && 'message' in _value
		? _value['reason'] === 'time' || _value['reason'] === 'start'
		: true;
};

const isOutgoingPayload: Validator<OAPM[keyof OAPM]> = (value): value is OAPM[keyof OAPM] => {
	return (
		typeof value === 'string' ||
		isPlayerPayload(value) ||
		isRoomPayload(value) ||
		isRoomArrayPayload(value) ||
		isIMessageOutgoingPayload(value) ||
		isIGameStartPayload(value)
	);
};

// leaderboard service result
const isLeaderBoardResult: Validator<LeaderBoardResult> = (value): value is LeaderBoardResult => {
	if (typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const _value = value as LeaderBoardResult;

	return (
		'page' in _value &&
		'totalPage' in _value &&
		'results' in _value &&
		(typeof _value.page === 'number' || isTypeOfUndefined(_value.page)) &&
		(typeof _value.totalPage === 'number' || isTypeOfUndefined(_value.page)) &&
		(Array.isArray(_value.results) || isTypeOfUndefined(_value.results))
	);
};

export {
	isRoom,
	isPlayer,
	isPlayerPayload,
	isRoomPayload,
	isRoomArrayPayload,
	isIMessageOutgoingPayload,
	isIGameStartPayload,
	isOutgoingPayload,
	isLeaderBoardResult,
};

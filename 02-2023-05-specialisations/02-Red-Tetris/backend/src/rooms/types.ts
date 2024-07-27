import { Validator } from '../base/typeGuards';
import Room from './Room';

export type ChangeRoom = 'join' | 'leave';

export const isRoomClass: Validator<Room> = (value): value is Room => {
	if (typeof value !== 'object') {
		return false;
	}
	const _value = value as Room;
	return (
		'_leader' in _value &&
		'_name' in _value &&
		'_dateCreated' in _value &&
		'_players' in _value &&
		'_game' in _value
	);
};

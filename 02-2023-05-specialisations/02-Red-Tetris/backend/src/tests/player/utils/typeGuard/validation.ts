import { Validator } from '../../../../base/typeGuards';
import { IPlayerJSON } from '../../../../eventsIO/payloads/types/IPayload';

const isPlayer: Validator<IPlayerJSON> = (value): value is IPlayerJSON => {
	if (typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const _player = value as IPlayerJSON;
	return (
		'username' in _player &&
		'sessionID' in _player &&
		'dateCreated' in _player &&
		'connected' in _player &&
		'leads' in _player &&
		'wins' in _player &&
		'games' in _player &&
		'roomsState' in _player
	);
};

export { isPlayer };

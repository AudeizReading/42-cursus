import { Validator } from '../base/typeGuards';
import Player from './Player';

export type PlayerState =
	| 'new'
	| 'reconnected'
	| 'disconnected'
	| 'ready'
	| 'idle'
	| 'active'
	| 'left'
	| undefined
	| null;

export const isPlayerClass: Validator<Player> = (value): value is Player => {
	if (typeof value !== 'object') {
		return false;
	}
	const _player = value as Player;
	return (
		'username' in _player &&
		'sessionID' in _player &&
		'_dateCreated' in _player &&
		'connected' in _player &&
		'_leads' in _player &&
		'_wins' in _player &&
		'_games' in _player &&
		'_rooms' in _player
	);
};

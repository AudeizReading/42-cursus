import type { TetriminosArrayType } from '$lib/game/gameUtils';
import type Player from './Player.interface';

export default interface PlayerGame {
	player: Player;
	map: TetriminosArrayType;
	score: number | string;
	level: number;
	endGame: boolean;
}

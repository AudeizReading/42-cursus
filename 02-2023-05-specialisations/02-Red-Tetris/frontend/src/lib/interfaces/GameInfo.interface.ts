import type { TetriminosArrayType } from '$lib/game/gameUtils';
import type Player from './Player.interface';

export interface GameInfo {
	endGame: boolean;
	level: number;
	map: { map: TetriminosArrayType };
	player: Player;
	score: number;
}

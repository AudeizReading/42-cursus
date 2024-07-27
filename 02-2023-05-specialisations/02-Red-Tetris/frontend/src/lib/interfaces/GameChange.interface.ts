import type { TetriminosArrayType } from '$lib/game/gameUtils';

export interface GameChange {
	map: TetriminosArrayType;
	nextPiece: TetriminosArrayType;
	soundEffect: string[];
	level: number;
	score: number;
}

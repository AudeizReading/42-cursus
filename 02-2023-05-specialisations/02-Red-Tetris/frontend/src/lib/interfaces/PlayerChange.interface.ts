import type Player from './Player.interface';

export interface PlayerChange {
	reason: string;
	player: Player;
}

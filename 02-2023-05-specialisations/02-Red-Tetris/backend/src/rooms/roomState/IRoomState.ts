import { PlayerState } from 'players/types';

export interface IRoomState {
	name: string;
	status: PlayerState;
	leads: boolean;
	wins?: boolean | undefined;
	readys: number;
	started: boolean;
}

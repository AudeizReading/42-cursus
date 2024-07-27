import { IStatePlayer, PlayerGame } from '../../../../games/GameLogic';
import { ISrvToCltPayload, GameStartReason } from './base';
import { IPlayerJSON } from './players';

interface IGameStartPayload extends ISrvToCltPayload {
	roomName: string;
	reason: GameStartReason;
	message?: string;
}

export interface IGameJSON {
	id: string;
	gamers: IPlayerJSON[];
	winner: IPlayerJSON | null;
	state: string;
}

type IGamePlayPayload<T extends IStatePlayer | PlayerGame | PlayerGame[]> = {
	gameId: string;
	payload: T;
};

export { IGameStartPayload, GameStartReason, IGamePlayPayload };

import { ISrvToCltPayload } from './base';
import { IGameJSON } from './games';
import { IPlayerJSON, IPlayerPayload } from './players';

interface IRoomJSON extends ISrvToCltPayload {
	name: string;
	dateCreated: Date;
	leader: IPlayerJSON;
	gameState: boolean;
	winner: IPlayerJSON | null;
	players: IPlayerJSON[];
	totalPlayers: number;
	readys: IPlayerJSON[];
	totalReady: number;
	games: IGameJSON[] | null;
}

interface IRoomPayload extends IPlayerPayload {
	room: IRoomJSON;
}

export { IRoomJSON, IRoomPayload };

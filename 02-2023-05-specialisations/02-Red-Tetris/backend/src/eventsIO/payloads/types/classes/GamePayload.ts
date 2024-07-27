import { IStatePlayer, PlayerGame } from '../../../../games/GameLogic';
import { GameStartReason, IGamePlayPayload, IGameStartPayload } from '../IPayload';

type IGSP = IGameStartPayload;
class GameStartPayload implements IGameStartPayload {
	protected constructor(
		public roomName: string,
		public reason: GameStartReason,
		public message?: string,
	) {}

	public static createPayload(roomName: string, reason: GameStartReason, message?: string): IGSP {
		return new GameStartPayload(roomName, reason, message);
	}
}

export class GamePlayPayload<T extends IStatePlayer | PlayerGame | PlayerGame[]> implements IGamePlayPayload<T> {
	protected constructor(
		public gameId: string,
		public payload: T,
	) {}

	public static createPayload<T extends IStatePlayer | PlayerGame | PlayerGame[]>(
		gameId: string,
		payload: T,
	): IGamePlayPayload<T> {
		return new GamePlayPayload(gameId, payload);
	}
}

export { GameStartPayload };

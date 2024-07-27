import { IGameJSON, IPlayerJSON } from '../eventsIO/payloads/types/IPayload';
import { logger } from '../infra';
import Player from '../players/Player';
import { GameLogic, PlayerGame, TypeAction } from './GameLogic';
import { GameService } from './GameService';
import Room from '../rooms/Room';
import { AGameState, CreatedState } from './gameStates';
import { UpdateRoleCommand } from '../rooms/useCases';
import { gameStore, GameStore } from './stores';
import { LeaderBoardController } from '../infra/leaderboard';

export default class Game {
	private _id: string;

	public gamers: Player[];
	public winner: Player | null = null;
	public state: AGameState = new CreatedState();
	public gameStore: GameStore = gameStore;

	protected logic: GameLogic = new GameLogic();
	protected service: GameService;

	public constructor(private room: Room) {
		this._id = `game_${room.name}_${this.state.date.getTime()}`;
		this.gamers = [...room.activePlayers];
		this.service = new GameService(this, room.io);
		this.state.context = { game: this, service: this.service, logic: this.logic };

		const log = `Game ${this._id} created`;
		logger.logContext(log, `game creation`, log);
	}

	public getPlayerGame(player: Player): PlayerGame {
		return this.logic?.endGame(player.sessionID);
	}

	public removePlayer(player: Player, playerGame: PlayerGame): Game {
		if (this.gamers.includes(player)) {
			this.handlePlayerRemoval(player, playerGame).checkGameEnd();
		}
		return this;
	}

	private handlePlayerRemoval(player: Player, playerGame: PlayerGame): Game {
		const room = this.room.name;
		const status = player.status(room);
		if (status !== 'disconnected') {
			this.service.leave(player);
		}
		this.gamers = this.gamers.filter((gamer) => gamer !== player);

		if (status !== 'disconnected' && status !== 'left') {
			this.room.updatePlayer(player, 'idle');
		} else {
			this.room.updatePlayer(player, status);
		}
		const log = `Game ${this._id}: remove player ${JSON.stringify(player)} (${status}),
			score ${JSON.stringify(playerGame)}`;
		logger.logContext(log, `remove player (${status})`, log);
		if (status !== 'disconnected') {
			this.service.emitEndGamePlayer(playerGame, player);
		}
		this.gameStore.addPlayerGame(this.id as string, player.sessionID, playerGame); // game end to player
		return this;
	}

	private checkGameEnd(): Game {
		if (this.gamers.length === 0) {
			this.finish();
			const log = `finished game Game ${this._id}\n
winner: ${JSON.stringify(this.winner)}\n
scores: ${JSON.stringify(this.gameStore.get(this.id)?.scores)}`;
			logger.logContext(log, `GameEnd`, log);
		}
		return this;
	}

	public transitionTo(state: AGameState): void {
		const log = `Game ${this._id} transition to ${state.constructor.name}`;
		logger.logContext(log, `game transition new state`, log);
		state.context = { game: this, service: this.service, logic: this.logic };
		this.state = state;
	}

	public start(): Game {
		this.state.start();
		return this;
	}

	public finish(): Game {
		this.state?.finish();
		return this;
	}

	public play(player: Player, action: TypeAction): Game {
		this.state.play(player, action);
		return this;
	}

	public get id(): string {
		return this._id;
	}

	public setWinner(): Game {
		if (!this.winner) {
			this.winner = this.room.get(this.gameStore.getWinnerId(this.id)) ?? null;
			if (this.winner) {
				// event roomChange 'new winner' emitted
				new UpdateRoleCommand(this.room, this.room.getService(this), 'win').execute(this.winner as Player);
			}
		}
		return this;
	}

	private addScores(): Game {
		const scores = this.gameStore.get(this.id)?.scores;
		if (scores && scores.length > 0) {
			scores.forEach((score) => {
				LeaderBoardController.insertByPlayerGame(score.playerGame).catch((err) => {
					logger.logContext(`Error: ${err}`, 'addScores', `Error: ${err}`);
				});
			});
		}
		return this;
	}

	public release(): Game {
		if (this.state.constructor.name === 'FinishedState') {
			return this.handleGameRelease();
		}
		return this;
	}

	private handleGameRelease(): Game {
		if (!this.winner) {
			this.setWinner().addScores(); // player change new winner
		}
		this.room.unlock().resetPlayersIdle();
		return this;
	}

	public toJSON(): IGameJSON {
		return {
			id: this._id,
			gamers: this.gamers.map((p) => p.toJSON() as IPlayerJSON),
			winner: this.winner?.toJSON() ?? null,
			state: this.state.constructor.name,
		};
	}
}

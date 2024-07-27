import { GameService } from '../GameService';
import Game from '../Game';
import { GameLogic, IStatePlayer, PlayerGame, TypeAction } from '../GameLogic';
import Player from '../../players/Player';
import { TimeoutManager } from '../../infra/io';

// https://refactoring.guru/fr/design-patterns/state
export abstract class AGameState {
	private ticks = parseInt(process.env.TICKS as string) ?? 128;
	private intervalMs = parseInt(process.env.TICKS_INTERVAL_MS as string) ?? 1000;
	private intervalID: NodeJS.Timeout | null = null;
	private specterIntervalID: NodeJS.Timeout | null = null;
	protected game: Game | null = null;
	protected service: GameService | null = null;
	protected logic: GameLogic | null = null;

	protected _date: Date = new Date();

	public set context(ctx: { game: Game; service: GameService; logic: GameLogic }) {
		const { game, service } = ctx;
		this.game = game;
		this.service = service;
		this.logic = ctx.logic;
	}

	public get date(): Date {
		return this._date;
	}

	private _update(): void {
		try {
			this.logic?.update();
			this.game?.gamers.forEach((gamer: Player) => {
				const stateGame = this.state(gamer);
				const state = this.game?.state.constructor.name ?? '';
				if (stateGame && state === `StartedState` && gamer.connected)
					this.service?.emitStatePlayer(stateGame, gamer.sessionID);
				const playerGame = this.logic?.endGame(gamer.sessionID);
				if (playerGame?.getEndGame()) this.game?.removePlayer(gamer, playerGame);
			});
		} catch (e) {
			if ((this.game?.state.constructor.name ?? '') === `StartedState`) this.game?.finish();
		}
	}

	private _specter(): void {
		try {
			const specters: PlayerGame[] = [];
			this.game?.gamers.forEach((gamer: Player) => {
				const playerGame = this.logic?.endGame(gamer.sessionID);
				if (playerGame) specters.push(playerGame);
				if (playerGame?.getEndGame()) this.game?.removePlayer(gamer, playerGame);
			});

			const endedSpecters = this.game?.gameStore.getEndedPlayerGames(this.game?.id);
			if (endedSpecters) specters.push(...endedSpecters);

			const state = this.game?.state.constructor.name ?? '';
			if (state === `StartedState`) this.service?.publishSpecter(specters);
		} catch (e) {
			if ((this.game?.state.constructor.name ?? '') === `StartedState`) this.game?.finish();
		}
	}

	protected update(): void {
		if (this.game) {
			this.intervalID = setInterval(() => {
				try {
					this._update();
				} catch (e) {
					if ((this.game?.state.constructor.name ?? '') === `StartedState`) this.game?.finish();
				}
			}, this.intervalMs / this.ticks);
			TimeoutManager.addInterval(this.intervalID);
		}
	}

	protected specter(): void {
		if (this.game) {
			this.specterIntervalID = setInterval(() => {
				try {
					this._specter();
				} catch (e) {
					if ((this.game?.state.constructor.name ?? '') === `StartedState`) this.game?.finish();
				}
			}, this.intervalMs);
			TimeoutManager.addInterval(this.specterIntervalID);
		}
	}

	protected clear(): void {
		if (this.intervalID) {
			clearInterval(this.intervalID);
		}
		if (this.specterIntervalID) {
			clearInterval(this.specterIntervalID);
		}
		const self = this.service?.self();
		if (self && self.size > 0) this.service?.finish();
	}

	public start(): void {
		try {
			this.update();
			this.specter();
		} catch (e) {
			this.clear();
		}
	}
	public abstract finish(): void;
	public abstract play(player: Player, action: TypeAction): void;

	public state(player: Player): IStatePlayer {
		if (!this.logic) throw new Error('Internal error. Contact your support team.');
		try {
			return this.logic.statePlayer(player);
		} catch (error) {
			throw new Error(`${(<Error>error).message}`);
		}
	}
}

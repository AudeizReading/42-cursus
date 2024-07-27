import Player from '../players/Player';

import { logRoom, logger } from '../infra/';

import { IGameStartPayload, IRoomJSON } from '../eventsIO/payloads/types/IPayload';
import { PlayerState } from '../players/types';
import { PayloadFactory } from '../eventsIO/payloads/PayloadFactory';
import { RoomState } from './roomState/RoomState';
import { RoomService } from './RoomService';
import Game from '../games/Game';
import { RoomEventsManager } from './events/manager';
import { AddPlayerCommand, RemovePlayerCommand } from './useCases';
import { RoomPropsBase } from './RoomPropsBase';
import { FinishedState, PlayGameCommand, StartGameCommand, StartedState } from '../games';
import { TypeAction } from '../games/GameLogic';

export default class Room extends RoomPropsBase {
	private _games: Record<string, Game> = {};
	private _lastWinner: Player | null = null;

	public constructor(
		name: string,
		leader: Player,
		protected service: RoomService,
		public events: RoomEventsManager = new RoomEventsManager(),
	) {
		super(name, service, leader);

		this.service.create(this, leader);
		this.timer.room = this;

		setTimeout(() => {
			if (this.empty) {
				this.events.notifyObserver('roomEmpty', this);
			}
		}, this.disconnectSession);
	}

	public close(): Room {
		if (this.game && this.game.state instanceof StartedState) {
			this.game.gamers.forEach((gamer) => {
				const game = this.game;
				if (game && game.state instanceof StartedState) {
					game?.removePlayer(gamer, game.getPlayerGame(gamer));
				}
			});
			this.game?.finish();
		}
		this.service.close(this, this.leader);
		this.log('CLOSING ROOM');
		return this;
	}

	public sendTimer(payload: IGameStartPayload): Room {
		this.service.timer(payload);
		return this;
	}

	public isReadytoPlay(player: Player): boolean {
		return !this.gameState && this.has(player.sessionID) && this.canStartGame();
	}

	public addPlayer(player: Player): Room {
		new AddPlayerCommand(this, this.service).execute(player);
		return this;
	}

	public unlock(): Room {
		this.timer.lock = false;
		this.lock = false;
		return this;
	}

	public getService(game: Game): RoomService {
		if (this._games[game.id] === game) {
			return this.service;
		}
		throw new Error('Internal error. Contact your support team.');
	}

	public updatePlayer(player: Player, status: PlayerState): Room {
		return this.updatePlayerState(player, status).updatePlayers(player);
	}

	private updatePlayers(player?: Player): Room {
		this.all
			.filter((p) => p !== player)
			.forEach((p) => {
				this.updatePlayerState(p, p.roomState(this.name)?.status ?? 'idle');
			});

		return this;
	}

	private updatePlayerState(player: Player, status: PlayerState): Room {
		player.addRoomState(
			new RoomState({
				name: this.name,
				status,
				leads: this.isLeader(player),
				readys: this.totalReady,
				wins: this.winner?.sessionID === player.sessionID ?? false,
				started: this.gameState,
			}),
		);

		return this;
	}

	public resetPlayersIdle(): Room {
		this.all.forEach((p) => {
			this.updatePlayer(p, 'active');
		});
		return this;
	}

	public removePlayer(player: Player): Room {
		new RemovePlayerCommand(this, this.service).execute(player);
		return this;
	}

	public get activePlayers(): Player[] {
		return this.all.filter((p) => p.status(this.name) === 'active');
	}

	// Methods related to the game

	public get gameState(): boolean {
		return this.game ? true : false;
	}

	public get winner(): Player | null {
		return this._lastWinner ?? null;
	}

	public set winner(player: Player) {
		this._lastWinner = player;
	}

	public startGame(player: Player): Room {
		try {
			new StartGameCommand(this, player).execute();
			this.updatePlayers();
		} catch (e) {
			if (this.service.isConnectedOnServer() && !this.service.isEmpty()) {
				throw new Error((<Error>e).message);
			}
		}
		return this;
	}

	public addGame(game: Game): Room {
		this._games[game.id] = game;
		return this;
	}

	public play(player: Player, action: TypeAction): Room {
		try {
			new PlayGameCommand(this, player, action).execute();
		} catch (e) {
			if (this.service.isConnectedOnServer() && !this.service.isEmpty()) {
				throw new Error((<Error>e).message);
			}
		}
		return this;
	}

	public get game(): Game | undefined {
		return this.games?.find((game) => game.state instanceof StartedState);
	}

	public lastFinishedGame(): Game | undefined {
		const finished = this.games?.filter((game) => game.state instanceof FinishedState);
		return finished ? finished[finished?.length - 1] : undefined;
	}

	public get games(): Game[] | null {
		return Object.values(this._games);
	}

	// utils
	public log(ctx: string): Room {
		const { raw, pretty } = logRoom(this);
		logger.logContext(raw, ctx, pretty);
		return this;
	}

	public toJSON(): IRoomJSON {
		return PayloadFactory.createRoomJSON(this);
	}
}

import Room from '../../rooms/Room';
import Player from '../../players/Player';
import { GameCommand } from './GameCommand';
import { TypeAction } from '../GameLogic';

export class PlayGameCommand extends GameCommand {
	public constructor(
		protected room: Room,
		protected player: Player,
		protected action: TypeAction,
	) {
		super(room);
	}

	public execute(): void {
		try {
			const room = this.room;
			const player = this.player;
			const sid = player.sessionID;
			const started = room.gameState;
			const game = room.game;
			const gamers = game?.gamers;
			const username = player.username;
			const hasPlayer = room.has(sid);
			const isInGame = gamers?.includes(player) ?? false;
			const action = this.action;
			if (hasPlayer && started && game && isInGame) {
				game.play(player, action);
			} else {
				if (!hasPlayer) {
					throw new Error(`Player ${username} not in room ${room.name} anymore`);
				}

				if (!started) {
					throw new Error(`Game finished for room ${room.name}`);
				}

				if (!isInGame) {
					throw new Error(`Game finished for player ${username} in room ${room.name}`);
				}
			}
		} catch (e) {
			throw new Error((<Error>e).message);
		}
	}
}

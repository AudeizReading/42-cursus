import { PlayerReady } from '../../players/PlayerReady';
import Player from '../../players/Player';
import Room from '../Room';
import { RoomService } from '../RoomService';
import { RoomCommand } from './Base';
import { logger } from '../../infra';
import { UpdateRoleCommand } from '.';

export class RemovePlayerCommand extends RoomCommand {
	public constructor(
		protected room: Room,
		protected service: RoomService,
	) {
		super(room, service);
	}

	public execute(player: Player): void {
		try {
			this.validatePlayerRemoval(player);
			this.processPlayerRemoval(player);
		} catch (e) {
			throw new Error(`${(<Error>e).message}`);
		}
	}

	private validatePlayerRemoval(player: Player): void {
		const { sessionID } = player;
		const { name } = this.room;
		if (!this.room.has(sessionID)) {
			this.service.error(`Not in room ${name}`);
		}
	}

	private processPlayerRemoval(player: Player): void {
		const wasLeader = !!this.room.isLeader(player);
		if (this.service.isConnectedOnServer() && this.service.hasPlayer(player)) {
			this.removePlayerFromRoom(player, wasLeader);
		} else if (!this.service.isConnectedOnServer()) {
			this.removeFromDisconnectedRoom(player);
		} else if (!this.service.hasPlayer(player)) {
			this.removeDisconnectedPlayer(player, wasLeader);
		}
	}

	private removePlayer(player: Player): void {
		new PlayerReady(player, this.room.name).delete(this.room);
		this.room.delete(player.sessionID);
		this.room.updatePlayer(player, 'left');
	}

	private removeFromDisconnectedRoom(player: Player): void {
		// Room does not exist anymore on server but still in manager
		this.removePlayer(player);
		this.service.handleRoomEmpty(this.room);
		logger.logContext(
			`player ${player.username} has left disconnected room ${this.room.name}`,
			'remove player from disconnected room',
			`player ${player.username} has left disconnected room ${this.room.name}`,
		);
	}

	private removeDisconnectedPlayer(player: Player, wasLeader: boolean): void {
		new PlayerReady(player, this.room.name).delete(this.room);
		const game = this.room.game;
		if (game) {
			game.removePlayer(player, game.getPlayerGame(player));
		}
		this.room.delete(player.sessionID);
		this.room.updatePlayer(player, 'disconnected');

		if (this.room.total === 0) {
			this.service.handleRoomEmpty(this.room);
		} else if (wasLeader) {
			new UpdateRoleCommand(this.room, this.service, 'lead').execute(player);
		}

		logger.logContext(
			`disconnected player ${player.username} has left room ${this.room.name}`,
			'remove disconnected player',
			`disconnected player ${player.username} has left room ${this.room.name}`,
		);
	}

	private removePlayerFromRoom(player: Player, wasLeader: boolean): void {
		this.removePlayer(player);
		this.service.leave(this.room, player);

		if (this.room.total === 0) {
			this.service.handleRoomEmpty(this.room);
		} else if (wasLeader) {
			new UpdateRoleCommand(this.room, this.service, 'lead').execute(player);
		}

		logger.logContext(
			`player ${player.username} has left room ${this.room.name}`,
			'remove player',
			`player ${player.username} has left room ${this.room.name}`,
		);
	}
}

import { PlayerReady } from '../../players/PlayerReady';
import Player from '../../players/Player';
import Room from '../Room';
import { RoomService } from '../RoomService';
import { RoomCommand } from './Base';

export class AddPlayerCommand extends RoomCommand {
	public constructor(
		protected room: Room,
		protected service: RoomService,
	) {
		super(room, service);
	}
	public execute(player: Player): void {
		if (!this.room.has(player.sessionID) && this.room.canJoin(player)) {
			new PlayerReady(player, this.room.name).add(this.room);
			this.room
				.log('addPlayer')
				.updatePlayer(player, this.room.gameState ? 'idle' : 'active')
				.save(player.sessionID, player);
			this.service.join(this.room, player);
		}
	}
}

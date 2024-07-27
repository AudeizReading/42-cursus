import Player from '../../../../players/Player';
import { IRoomState } from '../../../../rooms/roomState/IRoomState';
import { IPlayerJSON } from '../IPayload';

class PlayerJSON implements IPlayerJSON {
	public username: string;
	public sessionID: string;
	public dateCreated: Date;
	public leads: string[];
	public wins: string[];
	public connected: boolean;
	public roomsState: IRoomState[];

	private constructor(player: Player) {
		this.username = player.username;
		this.sessionID = player.sessionID;
		this.dateCreated = player.dateCreated;
		this.leads = player.leads;
		this.wins = player.wins;
		this.connected = player.connected;
		this.roomsState = player.rooms;
	}

	public static createPayload(player: Player): IPlayerJSON {
		return new PlayerJSON(player);
	}
}

export { PlayerJSON };

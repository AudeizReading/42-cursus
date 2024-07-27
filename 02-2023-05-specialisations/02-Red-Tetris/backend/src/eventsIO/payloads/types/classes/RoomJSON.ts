import Room from '../../../../rooms/Room';
import { IRoomJSON, IPlayerJSON, IGameJSON } from '../IPayload';
import Player from '../../../../players/Player';
import Game from '../../../../games/Game';

class RoomJSON {
	public name: string;
	public dateCreated: Date;
	public leader: IPlayerJSON;
	public gameState: boolean;
	public winner: IPlayerJSON | null;
	public players: IPlayerJSON[];
	public totalPlayers: number;
	public readys: IPlayerJSON[];
	public totalReady: number;
	public games: IGameJSON[] | null;

	public constructor(room: Room) {
		this.name = room.name;
		this.dateCreated = room.dateCreated;
		this.leader = room.leader.toJSON() as IPlayerJSON;
		this.gameState = room.gameState;
		this.winner = (room.winner?.toJSON() as IPlayerJSON) ?? null;
		this.players = room.all.map((p: Player) => p.toJSON() as IPlayerJSON);
		this.totalPlayers = room.total;
		this.readys = room.readyJSON;
		this.totalReady = room.totalReady;
		this.games = room.games?.map((g: Game) => g.toJSON()) ?? null;
	}

	public static createPayload(room: Room): IRoomJSON {
		return new RoomJSON(room);
	}
}

export { RoomJSON };

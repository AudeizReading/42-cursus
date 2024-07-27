import type Player from './Player.interface';

export default interface RoomType {
	name: string;
	dateCreated: string;
	leader: Player;
	gameState: boolean;
	winner?: Player;
	players: Player[];
	totalPlayers: number;
	readys: Player[];
	totalReady: number;
}

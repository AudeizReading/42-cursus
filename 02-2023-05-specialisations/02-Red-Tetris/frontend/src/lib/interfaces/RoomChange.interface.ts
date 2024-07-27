import type Player from './Player.interface';
import type RoomType from './Room.interface';

export default interface RoomChange {
	reason: string;
	room: RoomType;
	player: Player;
}

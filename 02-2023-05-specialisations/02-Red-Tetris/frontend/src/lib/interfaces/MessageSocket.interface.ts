import type Player from './Player.interface';
import type RoomType from './Room.interface';

export interface MessageSocket {
	message: string;
	emitter: Player;
	receiver: RoomType;
}

import Room from '../Room';
import RoomManager from 'rooms/RoomsManager';

export class RoomEmptyEventListener {
	public constructor(private rm: RoomManager) {}
	public update(room: Room): void {
		room.close();
		this.rm.delete(room.name);
	}
}

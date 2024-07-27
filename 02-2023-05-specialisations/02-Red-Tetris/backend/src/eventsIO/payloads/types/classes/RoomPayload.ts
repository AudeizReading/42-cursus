import { Change, IPlayerJSON, IRoomJSON, IRoomPayload } from '../IPayload';

class RoomPayload implements IRoomPayload {
	public room: IRoomJSON;
	public player: IPlayerJSON;
	public reason?: Change | undefined;
	protected constructor(room: IRoomJSON, player: IPlayerJSON, reason?: Change) {
		this.player = player;
		this.room = room;
		this.reason = reason;
	}

	public static createPayload(ro: IRoomJSON, p: IPlayerJSON, r?: Change): IRoomPayload {
		return new RoomPayload(ro, p, r);
	}
}

export { RoomPayload };

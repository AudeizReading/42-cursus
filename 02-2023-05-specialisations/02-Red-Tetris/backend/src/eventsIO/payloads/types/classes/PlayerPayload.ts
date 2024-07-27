import { IPlayerPayload, Change, IPlayerJSON } from '../IPayload';

class PlayerPayload implements IPlayerPayload {
	public reason?: Change;
	public player: IPlayerJSON;

	protected constructor(player: IPlayerJSON, reason?: Change) {
		this.reason = reason;
		this.player = player;
	}
	public static createPayload(player: IPlayerJSON, reason?: Change): PlayerPayload {
		return new PlayerPayload(player, reason);
	}
}

export { PlayerPayload };

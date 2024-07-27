import { SocketBase } from '../SocketBase';
import { EventCommand } from '.';
import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';
import { IAPM, IMIP } from '../payloads/types/IPayload';

export class ForwardMessage extends EventCommand {
	public constructor(
		protected base: SocketBase,
		protected pm: PlayersManager,
		protected rm: RoomManager,
	) {
		super(base, pm, rm);
	}

	public execute(): IAPM[keyof IAPM] {
		return (datas: IMIP): void => {
			const player = this.base.getSocketData().player.toJSON();

			if (this.pm.has(datas.receiver)) {
				// mp player -> player
				this.pm
					.getPlayerById(this.base.getSocketData().player.sessionID)
					.then((p) => {
						this.base.forwardMessage(datas, player, p);
					})
					.catch((e) => this.base.emit('error', `${(<Error>e).message}`));
			} else if (this.rm.has(datas.receiver)) {
				// mp player -> room
				this.rm
					.getRoomJSON(datas.receiver)
					.then((payload) => {
						this.base.forwardMessage(datas, player, payload);
					})
					.catch((e) => {
						this.base.emit('error', `${(<Error>e).message}`);
					});
			} else {
				this.base.emit('error', `receiver "${datas.receiver}" not found`);
			}
		};
	}
}

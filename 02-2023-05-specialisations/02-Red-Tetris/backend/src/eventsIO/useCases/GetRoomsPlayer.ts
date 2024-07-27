import { SocketBase } from '../SocketBase';
import { EventCommand } from '.';
import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';
import { IAPM } from '../payloads/types/IPayload';

export class GetRoomsPlayer extends EventCommand {
	public constructor(
		protected base: SocketBase,
		protected pm: PlayersManager,
		protected rm: RoomManager,
	) {
		super(base, pm, rm);
	}

	public execute(): IAPM[keyof IAPM] {
		return (): void => {
			try {
				this.pm
					.getPlayerById(this.base.getSocketData().player.sessionID)
					.then((p) => {
						this.base.emit('getRoomsPlayer', this.rm.roomsPlayerPayload(p));
					})
					.catch((e) => {
						this.base.emit('error', `${(<Error>e).message}`);
					});
			} catch (e) {
				this.base.emit('error', `${(<Error>e).message}`);
			}
		};
	}
}

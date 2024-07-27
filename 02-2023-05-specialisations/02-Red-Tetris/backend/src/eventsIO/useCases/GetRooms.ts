import { SocketBase } from '../SocketBase';
import { EventCommand } from '.';
import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';
import { IAPM } from '../payloads/types/IPayload';

export class GetRooms extends EventCommand {
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
				const rooms = this.rm.roomsJSON;
				this.base.emit('getRooms', rooms);
			} catch (e) {
				this.base.emit('error', `${(<Error>e).message}`);
			}
		};
	}
}

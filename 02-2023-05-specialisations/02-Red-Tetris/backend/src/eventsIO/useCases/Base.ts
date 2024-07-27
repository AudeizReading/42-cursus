import { SocketBase } from '../SocketBase';
import { IAPM } from '../payloads/types/IPayload';
import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';

export abstract class EventCommand {
	public constructor(
		protected base: SocketBase,
		protected pm: PlayersManager,
		protected rm: RoomManager,
	) {}
	public abstract execute(): IAPM[keyof IAPM] | void;
}

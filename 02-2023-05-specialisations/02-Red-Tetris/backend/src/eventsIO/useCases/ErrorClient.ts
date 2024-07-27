import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';
import { logger } from '../../infra';
import { IAPM } from '../payloads/types/IPayload';
import { SocketBase } from '../SocketBase';
import { EventCommand } from '.';

export class ErrorClient extends EventCommand {
	public constructor(
		protected base: SocketBase,
		protected pm: PlayersManager,
		protected rm: RoomManager,
	) {
		super(base, pm, rm);
	}

	public execute(): IAPM[keyof IAPM] {
		return (message: string) => {
			logger.logContext(message, 'Receiving client error', message);
			this.base.getSocket().disconnect();
		};
	}
}

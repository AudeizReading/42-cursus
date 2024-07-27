import { SocketBase } from '../SocketBase';
import { EventCommand } from '.';
import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';
import { IAPM } from '../payloads/types/IPayload';
import { PayloadFactory } from '../payloads/PayloadFactory';

export class ChangeUsername extends EventCommand {
	public constructor(
		protected base: SocketBase,
		protected pm: PlayersManager,
		protected rm: RoomManager,
	) {
		super(base, pm, rm);
	}

	public execute(): IAPM[keyof IAPM] {
		return (username: string): void => {
			try {
				this.pm
					.getPlayerById(this.base.getSocketData().player.sessionID)
					.then((p) => {
						p.username = username;
						const payload = PayloadFactory.createPlayerPayload(p, 'change username');
						this.base.emit('playerChange', payload);
					})
					.catch((e) => this.base.emit('error', `${(<Error>e).message}`));
			} catch (e) {
				this.base.emit('error', `${(<Error>e).message}`);
			}
		};
	}
}

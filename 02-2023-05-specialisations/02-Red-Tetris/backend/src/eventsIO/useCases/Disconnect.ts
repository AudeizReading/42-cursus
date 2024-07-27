import { SocketBase } from '../SocketBase';
import { EventCommand } from '.';
import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';
import { SessionManager, logger } from '../../infra';
import { IAPM } from '../payloads/types/IPayload';
import { PayloadFactory } from '../payloads/PayloadFactory';

export class Disconnect extends EventCommand {
	public constructor(
		protected base: SocketBase,
		protected pm: PlayersManager,
		protected rm: RoomManager,
		protected session: SessionManager,
	) {
		super(base, pm, rm);
	}

	public execute(): IAPM[keyof IAPM] {
		return (reason: string) => {
			const player = this.base.getSocketData().player;
			const log = `[${player.username}, ${player.sessionID} // ${reason}] disconnected`;
			logger.logContext(log, `disconnection: ${reason}`);
			try {
				const sid = player.sessionID;
				this.session.disconnectSocket(sid, this.base.getSocket());

				this.session.getSessionById(sid).then(() => {
					const payload = PayloadFactory.createPlayerPayload(player, 'disconnected player');
					this.base.broadcast('playerChange', payload);
					const log = `[${player.username}, ${player.sessionID} //\
 ${reason}] disconnected\n${JSON.stringify({ reason: payload.reason, player: payload.player })}`;
					logger.logContext(log, `emit playerChange: disconnected player ${reason}`);
				});
			} catch (e) {
				this.base.emit('error', `${(<Error>e).message}`);
			}
		};
	}
}

import { SocketBase } from '../SocketBase';
import { IAPM } from '../payloads/types/IPayload';
import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';
import { EventCommand, Ready } from '.';

export class ToggleCountDown extends EventCommand {
	public constructor(
		protected base: SocketBase,
		protected pm: PlayersManager,
		protected rm: RoomManager,
	) {
		super(base, pm, rm);
	}

	public execute(): IAPM[keyof IAPM] {
		return (name: string): void => {
			try {
				const room = this.rm.get(name);
				const player = this.base.getSocketData().player;

				if (room && room.isLeader(player) && !room.gameState) {
					new Ready(this.base, this.pm, this.rm).execute()(name);
					if (room.lock) {
						room.resetCountdown();
					} else {
						room.startCountdown(player, room);
					}
				} else {
					throw new Error('Internal error. Contact your support team.');
				}
			} catch (e) {
				this.base.emit('error', `${(<Error>e).message}`);
			}
		};
	}
}

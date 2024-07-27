import { SocketBase } from '../SocketBase';
import { EventCommand } from '.';
import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';
import { IAPM } from '../payloads/types/IPayload';
import { TypeAction } from '../../games/GameLogic';

export class GameChange extends EventCommand {
	public constructor(
		protected base: SocketBase,
		protected pm: PlayersManager,
		protected rm: RoomManager,
	) {
		super(base, pm, rm);
	}

	public execute(): IAPM[keyof IAPM] {
		return (data: { action: TypeAction; room: string }): void => {
			try {
				const { action, room } = data;
				const player = this.base.getSocketData().player;

				if (this.rm.get(room)) {
					this.rm.get(room)?.play(player, action);
				} else {
					throw new Error(`Room ${room} inexistant`);
				}
			} catch (e) {
				this.base.emit('error', `${(<Error>e).message}`);
			}
		};
	}
}

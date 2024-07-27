import { SocketBase } from '../SocketBase';
import { EventCommand } from '.';
import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';
import { IAPM } from '../payloads/types/IPayload';

export class GetRoom extends EventCommand {
	public constructor(
		protected base: SocketBase,
		protected pm: PlayersManager,
		protected rm: RoomManager,
	) {
		super(base, pm, rm);
	}

	public execute(): IAPM[keyof IAPM] {
		return (name: string): void => {
			this.rm
				.getRoomJSON(name)
				.then((payload) => {
					this.base.emit('roomInfo', payload);
				})
				.catch(() => {
					/* ici on renvoie null si aucune room,
					 * pas besoin de signaler l'erreur roomInfo est utilisé par
					 * le front pour savoir si il y a besoin de creer une room
					 * lorsqu'on utilise l'url /#room[user], le back peut pas accéder a cette partie de l'url
					 */
					this.base.emit('roomInfo', null);
				});
		};
	}
}

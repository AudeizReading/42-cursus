import { Socket } from 'socket.io';

import PlayersManager from '../../players/PlayersManager';
import RoomManager from '../../rooms/RoomsManager';
import { colors, logPlayer, logger } from '../../infra';

import { SocketBase } from '../SocketBase';
import { EventCommand } from '.';
export class LogOnAnyEvents extends EventCommand {
	public constructor(
		protected base: SocketBase,
		protected pm: PlayersManager,
		protected rm: RoomManager,
	) {
		super(base, pm, rm);
	}

	public execute(): void {
		this.base.emit('join', this.base.getSocketData().player.toJSON());

		(this.base.getSocket() as Socket).onAny((event, ...args) => {
			const ctx = `on ${event}`;
			const _args = JSON.stringify({ ...args });
			const sessionID = this.base.getSocketData().player.sessionID;
			const username = this.base.getSocketData().player.username;
			const sid = this.base.getSocket().id;
			const raw = `[${username}, ${sessionID} (socket: ${sid}) - ${event}]
			received arguments: ${JSON.stringify(args)}\n${logPlayer(this.base.getSocketData().player).raw}`;
			const pretty = `[${colors.fBlue}${username}, ${sessionID} \
			(socket: ${sid}) - ${event}${colors.reset}]
			${colors.underline}received arguments:${colors.reset} \
			${_args}\n${logPlayer(this.base.getSocketData().player).pretty}`;
			logger.logContext(raw, ctx, pretty);
		});
	}
}

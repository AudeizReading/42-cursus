import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { PM } from '../../../players/PlayersManager';
import { RM } from '../../../rooms/RoomsManager';
import { logSocket, logger } from '../../';
import {
	ExistingSessionStrategy,
	NewSessionStrategy,
	NextIoFunction,
	SessionCreationStrategy,
	SessionManager,
} from '.';
import {
	ExistingPlayerStrategy,
	NewPlayerStrategy,
	PlayerCreationStrategy,
} from '../../../players/strategy/PlayerCreationStrategy';

export class SessionHandler {
	private creationStrategy: SessionCreationStrategy;
	private playerCreationStrategy: PlayerCreationStrategy;
	public constructor(
		private pm: PM,
		private rm: RM,
		private sm: SessionManager,
	) {
		this.creationStrategy = new NewSessionStrategy(sm);
		this.playerCreationStrategy = new NewPlayerStrategy(pm);
	}

	private setCreationStrategy(strategy: SessionCreationStrategy): SessionHandler {
		this.creationStrategy = strategy;
		return this;
	}

	private setPlayerCreationStrategy(strategy: PlayerCreationStrategy): SessionHandler {
		this.playerCreationStrategy = strategy;
		return this;
	}

	public run(socket: Socket, next: NextIoFunction): void {
		let sid = socket.handshake.auth.sessionID;
		if (sid) {
			const s = new ExistingSessionStrategy(this.sm);
			const p = new ExistingPlayerStrategy(this.pm, this.rm);

			this.setCreationStrategy(s).setPlayerCreationStrategy(p);
		} else {
			if (
				this.creationStrategy instanceof ExistingSessionStrategy ||
				this.playerCreationStrategy instanceof ExistingPlayerStrategy
			) {
				const s = new NewSessionStrategy(this.sm);
				const p = new NewPlayerStrategy(this.pm);

				this.setCreationStrategy(s).setPlayerCreationStrategy(p);
			}
			sid = uuidv4();
		}
		this.playerCreationStrategy
			.create(sid, socket)
			.then((p) => {
				const socketLogs = logSocket(socket);
				logger.logContext(socketLogs.raw, 'NEW SOCKET CONNECTION', socketLogs.pretty);
				p.log(`starting session: generate player depending strategy`);
				this.creationStrategy
					.create(sid, socket)
					.then((s) => {
						s.log(`starting session: generate session depending strategy`);
						next();
					})
					.catch((e) => next(e));
			})
			.catch((e) => next(e));
	}
}

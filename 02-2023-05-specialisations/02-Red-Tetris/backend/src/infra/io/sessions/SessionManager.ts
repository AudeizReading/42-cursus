import { Socket } from 'socket.io';

import { PM } from '../../../players/PlayersManager';
import { RM } from '../../../rooms/RoomsManager';
import { colors, logger } from '../../';
import { DisconnectPlayer } from '../../../rooms/useCases';
import { IoMiddleware, NextIoFunction, Session, SessionEmptyEventListener, SessionHandler, SessionStore } from '.';
import { TimeoutManager } from '../TimeoutManager';

export class SessionManager {
	private sessionStore = new SessionStore();
	public sessionEmptyListener?: SessionEmptyEventListener;

	public constructor(
		public pm: PM,
		public rm: RM,
	) {}

	public getSessionById(sid: string): Promise<Session> {
		return new Promise<Session>((resolve, reject) => {
			const session = this.sessionStore.get(sid);
			if (session) {
				resolve(session);
			}
			reject(new Error(`Player ${sid} not found`));
		});
	}

	public save(sid: string, session: Session): SessionManager {
		this.sessionStore.save(sid, session);
		return this;
	}

	private delete(sid: string): SessionManager {
		this.sessionStore.delete(sid);
		return this;
	}

	public startSession(pc: PM, rm: RM): IoMiddleware {
		return (socket: Socket, next: NextIoFunction): void => {
			this.sessionEmptyListener = new SessionEmptyEventListener(this);

			const handler = new SessionHandler(pc, rm, this);
			handler.run(socket, next);
		};
	}

	public async close(session: Session): Promise<SessionManager> {
		logger.logContext(
			`session ${session.sid}[empty:${session.isEmpty()}] entering SessionManager close function`,
			'SessionManager::close scope',
			`session ${colors.fBlue}${colors.underline}${session.sid}[empty:${session.isEmpty()}]${colors.reset}\
 entering SessionManager close function`,
		);
		if (session.isEmpty()) {
			logger.logContext(
				`session ${session.sid}[empty:${session.isEmpty()}] entering SessionManager close function`,
				'SessionManager::close scope, check if session is empty then DisconnectPlayer',
				`session ${colors.fBlue}${colors.underline}${session.sid}[empty:${session.isEmpty()}]${colors.reset}\
 entering SessionManager close function`,
			);
			const sid = session.sid;
			const player = await this.pm.getPlayerById(sid);
			new DisconnectPlayer<RM>(this.rm).execute(player);
			const tm = setTimeout(
				() => {
					if (session.isEmpty()) {
						logger.logContext(
							`session ${session.sid}[empty:${session.isEmpty()}] entering SessionManager close function`,
							'SessionManager::close destroy timeout scope, check if session is empty',
							`session ${colors.fBlue}${colors.underline}${session.sid}\
[empty:${session.isEmpty()}]${colors.reset}\
 entering SessionManager close function`,
						);
						this.delete(sid);
						this.pm.delete(sid);
						logger.logContext(
							`session ${sid} ${player.username} closed`,
							'closed session',
							`session ${colors.fBlue}${colors.underline}${sid} ${player.username}${colors.reset} closed`,
						);
					}
				},
				parseInt(process.env.DESTROY_TIMER ?? '10', 15) * 1000,
			);
			TimeoutManager.addTimeout(tm);
		}
		return this;
	}

	public disconnectSocket(sid: string, socket: Socket): void {
		this.getSessionById(sid).then((s) => s.disconnect(socket));
	}

	public log(context: string): void {
		const llog = `${this.sessionStore.total} session(s) registered:\n`;
		const log = `${this.sessionStore.total} session(s) registered:\n`;
		logger.logContext(llog, 'session manager log', log);
		this.sessionStore.all.forEach((session) => {
			session.log(context);
		});
	}
}

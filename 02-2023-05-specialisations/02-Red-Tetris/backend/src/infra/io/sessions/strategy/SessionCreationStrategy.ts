import { Socket } from 'socket.io';
import { CreationStrategy } from '../../../../base/Strategy';

import { Session, SessionEmptyEventListener } from '..';

export abstract class SessionCreationStrategy implements CreationStrategy<Session, Socket> {
	public abstract create(name: string, data: Socket): Promise<Session>;
}

export class ExistingSessionStrategy<
	T extends {
		getSessionById: (sid: string) => Promise<Session>;
		save: (sid: string, session: Session) => void;
		sessionEmptyListener?: SessionEmptyEventListener;
	},
> extends SessionCreationStrategy {
	public constructor(public manager: T) {
		super();
	}
	public async create(name: string, socket: Socket): Promise<Session> {
		socket.join(name);
		const session = await this.manager.getSessionById(name);
		session.push(socket);
		return session;
	}
}

export class NewSessionStrategy<
	T extends {
		getSessionById: (sid: string) => Promise<Session>;
		save: (sid: string, session: Session) => void;
		sessionEmptyListener?: SessionEmptyEventListener | undefined;
	},
> extends SessionCreationStrategy {
	public constructor(public manager: T) {
		super();
	}
	public async create(sid: string, socket: Socket): Promise<Session> {
		return await new Promise((resolve) => {
			const session = new Session(sid, socket);
			if (this.manager.sessionEmptyListener) {
				socket.join(sid);
				session.events.addObserver('sessionEmpty', this.manager.sessionEmptyListener);
			}
			this.manager.save(sid, session);
			resolve(session);
		});
	}
}

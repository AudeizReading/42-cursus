import { Session, SessionManager } from '..';
import { EventsManager } from '../../../../base/Observer';

export class SessionEventsManager extends EventsManager<SessionEmptyEventListener, Session> {}

export class SessionEmptyEventListener {
	public constructor(private manager: SessionManager) {}
	public update(session: Session): void {
		this.manager.close(session);
	}
}

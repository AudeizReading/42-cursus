import { Session } from '..';
import IStore from '../../../../base/IStore';

export class SessionStore implements IStore<Session> {
	private sessions: Map<string, Session> = new Map();

	public get(id: string): Session | undefined {
		return this.sessions.get(id);
	}

	public save(id: string, session: Session): void {
		this.sessions.set(id, session);
	}

	public get all(): Session[] {
		return [...this.sessions.values()];
	}

	public delete(id: string): void {
		this.sessions.delete(id);
	}

	public has(id: string): boolean {
		return this.sessions.has(id);
	}

	public get total(): number {
		return this.sessions.size;
	}
}

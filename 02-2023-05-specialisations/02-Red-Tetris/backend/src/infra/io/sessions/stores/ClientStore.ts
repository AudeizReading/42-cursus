import { Socket } from 'socket.io';
import IStore from '../../../../base/IStore';
import { ClientInfos } from '..';

export class ClientInfosStore implements IStore<ClientInfos> {
	private clientsInfos: Map<string, ClientInfos> = new Map();

	public get(id: string): ClientInfos | undefined {
		return this.clientsInfos.get(id);
	}

	public save(id: string, clientInfos: ClientInfos): void {
		this.clientsInfos.set(id, clientInfos);
	}

	public get all(): ClientInfos[] {
		return [...this.clientsInfos.values()];
	}

	public delete(id: string): void {
		this.clientsInfos.delete(id);
	}

	public has(id: string): boolean {
		return this.clientsInfos.has(id);
	}

	public get total(): number {
		return this.clientsInfos.size;
	}

	public disconnect(socket: Socket): void {
		if (this.has(socket.id)) {
			socket.disconnect();
			this.delete(socket.id);
		}
	}
}

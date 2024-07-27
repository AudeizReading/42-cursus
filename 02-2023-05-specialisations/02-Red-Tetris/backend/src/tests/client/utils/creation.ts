import { ISocketAuth } from 'infra';
import { Socket, io } from 'socket.io-client';
import { disconnectOneClient } from '../events';

const protocol = process.env.PROTOCOL || 'ws';
const host = process.env.HOST || 'localhost';
const serverPort = process.env.PORT || '8080';

const createClient = (auth: ISocketAuth): Socket => {
	const socket: Socket = io(`${protocol}://${host}:${serverPort}`, {
		forceNew: false,
		reconnectionDelay: 0,
		reconnection: true,
		auth: auth,
		autoConnect: false,
	});
	return socket;
};

export type DatasClient = {
	sessionID: string;
	clients: Socket[];
};
const datasClients: DatasClient[] = [];

export { datasClients };

export function updateDatasClients(client: Socket, sid: string): void {
	const index = datasClients.findIndex((d) => d.sessionID === sid);
	if (index !== -1) {
		const clientIndex = datasClients[index].clients.findIndex((cl) => cl.id === client.id);

		// si la socket est deja connue, on update
		if (clientIndex !== -1) {
			datasClients[index].clients[clientIndex] = client;
		} else {
			// sinon on l'ajoute
			datasClients[index].clients.push(client);
		}
	} else {
		// sinon on le cree
		datasClients.push({
			sessionID: sid,
			clients: [client],
		});
	}
}

export function getClients(): { [key: string]: { [key: string]: Socket[] } } {
	return datasClients.reduce((acc, d) => {
		const { clients, sessionID } = d;
		return { ...acc, [sessionID]: [...clients] };
	}, {});
}

export function disconnectAllClients(done: (err?: Error) => void): void {
	// ne recuperer que les sockets dans l'obj clients
	const clients = datasClients.map((d) => d.clients).flat();

	clients.forEach((cl: Socket) => {
		disconnectOneClient(cl, done);
	});
}

export { createClient };

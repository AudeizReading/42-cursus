import { Socket } from 'socket.io-client';
import { OEvent, OPayload } from '..';
import { outgoingBasicHandler } from '../handlers';
import { createClient, datasClients, updateDatasClients } from '../../utils/creation';

// multiply sockets with the same player
export async function duplicateClient(client: Socket, username: string, nb: number): Promise<Array<OPayload<'join'>>> {
	const event: OEvent = 'join';
	const old = client.id;
	return await new Promise<Array<OPayload<typeof event>>>((resolve, reject) => {
		const payloads: Array<OPayload<'join'>> = [];
		const errorHandler = outgoingBasicHandler<'error'>({ resolve: reject });

		const sid = datasClients.find((d) => d.clients.some((cl) => cl.id === old))?.sessionID ?? '';
		const clients = Array(nb)
			.fill(0)
			.map(() => {
				return createClient({
					username: username,
					sessionID: sid,
				});
			});

		clients.forEach((client) => {
			client.on('error', errorHandler);
			client.on(event, (payload: OPayload<typeof event>) => {
				updateDatasClients(client, (<OPayload<typeof event>>payload).sessionID);
				client.off(event);
				payloads.push(payload);
				if (payloads.length === nb) {
					resolve(payloads);
				}
			});
			client.connect();
		});
	});
}

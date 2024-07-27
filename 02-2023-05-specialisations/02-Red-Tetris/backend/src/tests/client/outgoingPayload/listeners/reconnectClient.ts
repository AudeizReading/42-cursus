import { Socket } from 'socket.io-client';
import { OEvent, OPayload } from '..';
import { createClient, datasClients, updateDatasClients } from '../../utils/creation';
import { outgoingBasicHandler } from '../handlers';

export async function reconnectClient(client: Socket, username: string): Promise<OPayload<'join'>> {
	const event: OEvent = 'join';
	const old = client.id;
	return await new Promise<OPayload<typeof event>>((resolve, reject) => {
		const errorHandler = outgoingBasicHandler<'error'>({ resolve: reject });

		const sid = datasClients.find((d) => d.clients.some((cl) => cl.id === old))?.sessionID ?? '';

		client.on('error', errorHandler);
		client.on('disconnect', () => {
			client.off('disconnect');
			client = createClient({
				username: username,
				sessionID: sid,
			});

			client.on(event, (payload: OPayload<typeof event>) => {
				updateDatasClients(client, (<OPayload<typeof event>>payload).sessionID);
				client.off(event);
				resolve(payload);
			});
			client.connect();
		});

		client.disconnect();
	});
}

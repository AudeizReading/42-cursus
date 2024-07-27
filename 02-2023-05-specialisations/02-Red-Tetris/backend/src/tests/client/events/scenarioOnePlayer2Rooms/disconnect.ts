import { destroyTimer } from '../../../utils/env';
import { Socket } from '..';

export function disconnectOneClient(client: Socket, done: (err?: Error) => void): void {
	client.on('disconnect', () => {
		client.off('disconnect');
		setTimeout(() => {
			done();
		}, destroyTimer);
	});
	client.disconnect();
}

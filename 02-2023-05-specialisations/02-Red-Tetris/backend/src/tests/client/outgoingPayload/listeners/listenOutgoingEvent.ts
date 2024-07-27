import { IncomingActionPayloadMap as IAPM, IncomingAction } from '../../incomingPayload/types';
import { OAPM } from '..';
import { Socket } from 'socket.io-client';
import {
	outgoingBasicHandler,
	outgoingGameStartHandler,
	outgoingJoinHandler,
	outgoingPlayerChangeHandler,
	outgoingRoomChangeHandler,
	outgoingRoomCloseHandler,
	outgoingRoomOpenedHandler,
	sessionId,
} from '../handlers';
import { isTypeOfUndefined } from '../../../../base/typeGuards';

export async function listenOutgoingEvent<T extends keyof OAPM, U extends keyof IAPM>(
	client: Socket,
	eventListener: string,
	emit: IncomingAction<U> | undefined,
): Promise<OAPM[T]> {
	return await new Promise<OAPM[T]>((resolve, reject) => {
		let handler;
		switch (eventListener) {
			case 'join':
				client.connect();
				handler = outgoingJoinHandler({ resolve });
				break;
			case 'playerChange':
				handler = outgoingPlayerChangeHandler({ resolve, sessionId });
				break;
			case 'roomOpened':
				handler = outgoingRoomOpenedHandler({ resolve, data: emit?.payload });
				break;
			case 'roomChange':
				handler = outgoingRoomChangeHandler({ resolve, data: emit?.payload });
				break;
			case 'roomClosed':
				handler = outgoingRoomCloseHandler({ resolve, data: emit?.payload });
				break;
			case 'gameStart' || 'ready':
				handler = outgoingGameStartHandler({ resolve, data: emit?.payload });
				break;
			default:
				handler = outgoingBasicHandler({ resolve });
		}
		const errorHandler = outgoingBasicHandler<'error'>({ resolve: reject });

		client.on(eventListener, handler);
		client.on('error', errorHandler);
		if (!isTypeOfUndefined(emit)) {
			client.emit(emit.event, emit?.payload);
		}
	});
}

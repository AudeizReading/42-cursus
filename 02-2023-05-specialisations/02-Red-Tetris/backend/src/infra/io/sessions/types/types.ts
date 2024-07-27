import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import { Validator } from '../../../../base/typeGuards';
import { Session } from '..';

export type ClientInfos = {
	socket: Socket | null;
	disconnectTimer: NodeJS.Timeout | null;
};

export type NextIoFunction = (err?: ExtendedError | undefined) => void;
export type IoMiddleware = (socket: Socket, next: NextIoFunction) => void;

export const isSessionClass: Validator<Session> = (value): value is Session => {
	if (typeof value !== 'object') {
		return false;
	}
	const session = value as Session;
	return '_sid' in session && 'clientInfosStore' in session;
};

import { PUBLIC_DOMAIN_BACK, PUBLIC_PORT_BACK, PUBLIC_PROTOCAL_WS } from '$env/static/public';
import ioClient from 'socket.io-client';

const socket = ioClient(`${PUBLIC_PROTOCAL_WS}://${PUBLIC_DOMAIN_BACK}:${PUBLIC_PORT_BACK}`, {
	autoConnect: false,
});
export const io = socket;

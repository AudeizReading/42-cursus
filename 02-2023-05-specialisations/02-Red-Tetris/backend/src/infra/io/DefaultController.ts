import { Server, Socket } from 'socket.io';

import PlayersManager from '../../players/PlayersManager';
import RoomsManager from '../../rooms/RoomsManager';

import SocketController from '../../eventsIO/SocketController';
import { NextIoFunction, ServerService, SessionManager } from '.';

export default class DefaultController {
	private _pc: PlayersManager;
	private _rc: RoomsManager;
	private _sm: SessionManager;
	private _io: Server;
	private _ss: ServerService;

	public constructor(io: Server) {
		this._io = io;

		this._ss = new ServerService(this._io);
		this._pc = new PlayersManager();
		this._rc = new RoomsManager(this._ss, this._io);
		this._sm = new SessionManager(this._pc, this._rc);

		this.use = this.use.bind(this);

		this.use(this._sm.startSession(this._pc, this._rc));

		this._io.on('connection', (socket: Socket) => {
			try {
				new SocketController(socket, this._ss, this._pc, this._rc, this._sm);
			} catch (e) {
				throw new Error(`${(<Error>e).message}`);
			}
		});
	}

	public use(middleware: (socket: Socket, next: NextIoFunction) => void): void {
		this._io.use(middleware);
	}
}

import { Socket } from 'socket.io';

import { ServerService, SessionManager } from '../infra';

import {
	ChangeUsername,
	CreateRoom,
	Disconnect,
	ErrorClient,
	ForwardMessage,
	GameChange,
	GetRoom,
	GetRooms,
	GetRoomsPlayer,
	JoinRedTetris,
	JoinRoom,
	LeaveRoom,
	LogOnAnyEvents,
	Ready,
	ToggleCountDown,
} from './useCases';
import { SocketBase } from './SocketBase';
import { PM } from '../players/PlayersManager';
import { RM } from '../rooms/RoomsManager';

export default class SocketController extends SocketBase {
	public constructor(
		protected socket: Socket,
		protected io: ServerService,
		pm: PM,
		rm: RM,
		sm: SessionManager,
	) {
		super(socket, io);

		this.handlers = {
			disconnect: new Disconnect(this, pm, rm, sm).execute(),
			message: new ForwardMessage(this, pm, rm).execute(),
			ready: new Ready(this, pm, rm).execute(),
			createRoom: new CreateRoom(this, pm, rm).execute(),
			joinRoom: new JoinRoom(this, pm, rm).execute(),
			leaveRoom: new LeaveRoom(this, pm, rm).execute(),
			getRoom: new GetRoom(this, pm, rm).execute(),
			getRooms: new GetRooms(this, pm, rm).execute(),
			getRoomsPlayer: new GetRoomsPlayer(this, pm, rm).execute(),
			changeUsername: new ChangeUsername(this, pm, rm).execute(),
			gameChange: new GameChange(this, pm, rm).execute(),
			gameStart: new ToggleCountDown(this, pm, rm).execute(),
			error: new ErrorClient(this, pm, rm).execute(),
		};
		this.listen();
		new JoinRedTetris(this, pm, rm).execute();
		new LogOnAnyEvents(this, pm, rm).execute();
	}
}

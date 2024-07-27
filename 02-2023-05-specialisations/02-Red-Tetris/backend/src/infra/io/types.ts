import { IStatePlayer, PlayerGame, TypeAction } from '../../games/GameLogic';
import {
	ISrvToCltPayload,
	IPlayerPayload,
	IRoomPayload,
	IMIP,
	IMOP,
	IGameStartPayload,
	IGamePlayPayload,
} from '../../eventsIO/payloads/types/IPayload';
import Player from '../../players/Player';

interface ISocketData {
	player: Player;
}

interface ISocketAuth {
	username: string;
	sessionID?: string;
}

interface IInterSrvEvts {
	error: (error: Error) => void;
	ping: () => void;
}

interface ISrvToCltEvts {
	// emitted by the server
	join: (player: ISrvToCltPayload) => void;
	playerChange: (payload: IPlayerPayload) => void;
	getRooms: (rooms: ISrvToCltPayload[]) => void;
	getRoomsPlayer: (rooms: ISrvToCltPayload[]) => void;
	roomChange: (payload: IRoomPayload) => void;
	roomOpened: (payload: IRoomPayload) => void;
	roomClosed: (payload: IRoomPayload) => void;
	roomInfo: (room: ISrvToCltPayload) => void;
	message: (payload: IMOP) => void;
	error: (message: string) => void;
	gameStart: (payload: IGameStartPayload) => void;
	gameChange: (payload: IGamePlayPayload<IStatePlayer>) => void;
	gameEnd: (payload: IGamePlayPayload<PlayerGame>) => void;
	gameInfo: (payload: IGamePlayPayload<PlayerGame[]>) => void;
}

interface ICltToSrvEvts {
	error(message: string): void;
	message(payload: IMIP): void;
	ready(roomName: string): void;
	createRoom: (roomName: string) => void;
	joinRoom: (roomName: string) => void;
	leaveRoom: (roomName: string) => void;
	gameStart: (roomName: string) => void;
	getRooms: () => void;
	changeUsername: (username: string) => void;
	getRoom: (roomName: string) => void;
	getRoomsPlayer: () => void;
	gameChange: (data: { action: TypeAction; room: string }) => void;
	disconnect: (reason: string) => void;
}

export { ISrvToCltEvts, ISocketData, ICltToSrvEvts, IInterSrvEvts, ISocketAuth };

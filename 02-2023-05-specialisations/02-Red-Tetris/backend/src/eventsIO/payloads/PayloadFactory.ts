import {
	IPlayerJSON,
	IRoomJSON,
	IPlayerPayload,
	Change,
	IRoomPayload,
	IMIP,
	IMOP,
	IBrodacastFormat,
	OAPM,
	IGameStartPayload,
	GameStartReason,
	IGamePlayPayload,
} from './types/IPayload';
import {
	PlayerJSON,
	RoomJSON,
	PlayerPayload,
	RoomPayload,
	MessageIncomingPayload,
	MessageOutgoingPayload,
	BrodcastFormat,
	GameStartPayload,
} from './types/Payloads';
import Room from '../../rooms/Room';
import Player from '../../players/Player';
import { GamePlayPayload } from './types/classes/GamePayload';
import { IStatePlayer, PlayerGame } from 'games/GameLogic';

class PayloadFactory {
	public static createRoomJSON(room: Room): IRoomJSON {
		return RoomJSON.createPayload(room);
	}

	public static createPlayerJSON(player: Player): IPlayerJSON {
		return PlayerJSON.createPayload(player);
	}

	public static createPlayerPayload(player: Player, reason?: Change): IPlayerPayload {
		return PlayerPayload.createPayload(PlayerJSON.createPayload(player), reason);
	}

	public static createRoomPayload(room: Room, player: Player, reason?: Change): IRoomPayload {
		const _room = RoomJSON.createPayload(room);
		return RoomPayload.createPayload(_room, PlayerJSON.createPayload(player), reason);
	}

	public static createIMIP(message: string, receiver: string): IMIP {
		return MessageIncomingPayload.createPayload(message, receiver);
	}

	public static createIMOP(
		message: string,
		date: Date,
		emitter: IPlayerJSON,
		receiver: IPlayerJSON | IRoomJSON | undefined,
	): IMOP {
		return MessageOutgoingPayload.createPayload(message, date, emitter, receiver);
	}

	public static createGameStartPayload(
		roomName: string,
		reason: GameStartReason,
		message?: string | undefined,
	): IGameStartPayload {
		return GameStartPayload.createPayload(roomName, reason, message);
	}

	public static createGamePlayPayload<T extends IStatePlayer | PlayerGame | PlayerGame[]>(
		gameId: string,
		payload: T,
	): IGamePlayPayload<T> {
		return GamePlayPayload.createPayload(gameId, payload);
	}

	public static createBroadcastFormat<T extends keyof OAPM>(
		event: T,
		data: OAPM[T],
		sid?: string,
		room?: string,
	): IBrodacastFormat {
		return BrodcastFormat.createPayload(event, data, sid, room);
	}
}

export { PayloadFactory };

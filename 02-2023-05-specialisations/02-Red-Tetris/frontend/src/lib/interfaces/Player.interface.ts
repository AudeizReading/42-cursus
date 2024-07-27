import type RoomState from './RoomState.interface';

export default interface Player {
	username: string;
	sessionID: string;
	dateCreated: string;
	connected: boolean;
	leads: string[];
	wins: string[];
	roomsState: RoomState[];
}

export type StatusPlayer = 'ready' | 'idle';

export default interface RoomState {
	lead: true;
	name: string;
	readys: number;
	stated: boolean;
	status: StatusPlayer;
}

type Reason = 'time' | 'start';

export default interface GameStart {
	roomName: string;
	reason: Reason;
	message?: string;
}

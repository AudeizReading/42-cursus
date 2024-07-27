import { PlayerState } from '../../players/types';
import { IRoomState } from './IRoomState';

export class RoomState implements IRoomState {
	[key: string]:
		| string
		| PlayerState
		| boolean
		| number
		| undefined
		| ((data: string) => void)
		| ((status: PlayerState, name: string) => void);
	public name: string = '';
	public status: PlayerState = 'active';
	public leads: boolean = false;
	public wins: boolean = false;
	public readys: number = 0;
	public started: boolean = false;

	public constructor(props: Partial<RoomState>) {
		for (const [key, value] of Object.entries(props)) {
			if (typeof value !== 'function') this[key] = value;
		}
	}

	private toggleReady(): void {
		if (this.status?.includes('ready')) {
			this.status = 'idle';
		} else if (this.started === false && this.status?.match(/idle|active/)) {
			this.status = 'ready';
		}
	}

	public changeStatus(status: PlayerState): void {
		if (status === 'ready') {
			this.toggleReady();
		} else {
			this.status = status;
		}
	}

	public toggleLeads(): void {
		this.leads = !this.leads;
	}

	public toggleWins(): void {
		this.wins = !this.wins;
	}

	public toggleStarted(): void {
		this.started = !this.started;
	}
}

import { PlayerState } from './types';
import { logPlayer, logger } from '../infra';
import { IRoomState } from '../rooms/roomState/IRoomState';
import { IPlayerJSON } from '../eventsIO/payloads/types/IPayload';
import { PayloadFactory } from '../eventsIO/payloads/PayloadFactory';
import { Observable } from '../base/Observer';
import { RoomStateStore } from '../rooms/roomState/store';
import { RoomState } from '../rooms/roomState/RoomState';

class Player extends Observable {
	public get [Symbol.toStringTag](): string {
		return `Player ${this.username} - [${this.sessionID}]`;
	}
	[key: string]: unknown;
	private _dateCreated: Date = new Date();

	private _leads: string[] = [];
	private _wins: string[] = [];
	public connected: boolean = true;
	private _states: RoomStateStore = new RoomStateStore();

	public constructor(
		public username: string,
		public sessionID: string,
	) {
		super();
		if (username.match(/[^a-zA-Z0-9_-]/)) {
			throw new Error(`Invalid username: ${username}`);
		}
		this.log(`create Player ${username}`);
	}

	public addRoomState(roomState: RoomState): void {
		this._states.save(roomState.name, roomState);
	}

	public get roomsState(): IRoomState[] {
		return this._states.all;
	}

	public roomState(roomName: string): IRoomState | undefined {
		return this._states.get(roomName);
	}

	public status(roomName: string): PlayerState | undefined {
		return this.roomState(roomName)?.status;
	}

	public changeRoomStatus(status: PlayerState, name: string): void {
		const roomState = this._states.get(name);
		if (roomState) {
			roomState.changeStatus(status);
			if (status === 'ready') {
				this.notifyObserver(name, 'PlayerReady');
			}
		}
	}

	public get rooms(): IRoomState[] {
		return [...this._states.all];
	}

	public get dateCreated(): Date {
		return this._dateCreated;
	}

	public get leads(): string[] {
		return this._leads;
	}

	public set leads(value: string) {
		this.leads.push(value);
	}

	public get wins(): string[] {
		return this._wins;
	}

	public set wins(value: string) {
		if (this.wins.length > 0) this.wins.push(value);
		else this._wins = [value];
	}

	public disconnect(): void {
		try {
			this.connected = false;
			this.roomsState.forEach((state) => {
				this.changeRoomStatus('disconnected', state.name);
			});
		} catch (e) {
			throw new Error((<Error>e).message);
		}
	}

	public log(ctx: string): void {
		const { raw, pretty } = logPlayer(this);
		logger.logContext(raw, ctx, pretty);
	}

	public toJSON(): IPlayerJSON {
		return PayloadFactory.createPlayerJSON(this);
	}
}

export default Player;

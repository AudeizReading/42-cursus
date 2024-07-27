import Player from '../../players/Player';
import Room from '../Room';
import { RoomService } from '../RoomService';
import { RoomCommand } from './Base';

export type RoleRoom = 'lead' | 'win';
export type ContextRoom = {
	room: Room;
	service: RoomService;
	role: RoleRoom;
};
export abstract class ARole {
	protected _context: ContextRoom | undefined = undefined;
	public abstract name: string;

	public set context(value: ContextRoom) {
		this._context = value;
	}
	public abstract remove(player: Player): void;
}

export class LeaderRole extends ARole {
	public name = 'leader';
	public remove(player: Player): void {
		if (this._context) {
			player.leads.splice(player.leads.indexOf(this._context.room.name), 1);
			this._context.room.leader = this._context.room.all[0];
			if (!this._context.room.leader.leads.includes(this._context.room.name)) {
				this._context.room.leader.leads.push(this._context.room.name);
			}
		}
	}
}
export class WinnerRole extends ARole {
	public name = 'winner';
	public remove(player: Player): void {
		if (this._context) {
			const last = this._context.room.lastFinishedGame();
			if (last) {
				player.wins = last.id;
				this._context.room.winner = player;
			}
		}
	}
}

export class UpdateRoleCommand extends RoomCommand {
	private _role: ARole | undefined = undefined;
	public constructor(
		protected room: Room,
		protected service: RoomService,
		protected role: RoleRoom,
	) {
		super(room, service);
		this.transition = role;
	}

	private set transition(role: RoleRoom) {
		const reason: 'leader' | 'winner' = role.concat(role.endsWith('n') ? 'ner' : 'er') as 'leader' | 'winner';
		switch (reason) {
			case 'leader':
				this.transitionTo(new LeaderRole());
				break;
			case 'winner':
				this.transitionTo(new WinnerRole());
				break;
		}
	}

	private transitionTo(role: ARole): void {
		this._role = role;
		this._role.context = {
			room: this.room,
			service: this.service,
			role: this.role,
		};
	}

	public execute(player: Player): void {
		if (this._role) {
			this._role.remove(player);
			this.room.updatePlayer(player, player.status(this.room.name));
			if (this.service.isConnectedOnServer()) {
				if (this._role.name === 'leader') {
					this.service.publishNewRole(this._role.name as 'leader', this.room, this.room.leader);
				} else {
					this.service.publishNewRole(this._role.name as 'winner', this.room, player);
				}
			}
			player.log(`[PLAYER] change role ${player.username} ${this._role.name} room ${this.room.name}`);
			this.room.log(`[ROOM] change role ${player.username} ${this._role.name} room ${this.room.name}`);
		}
	}
}

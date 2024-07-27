import Room from '../../rooms/Room';
import { CreationStrategy } from '../../base/Strategy';
import Player from '../Player';
import { Socket } from 'socket.io';

export abstract class PlayerCreationStrategy implements CreationStrategy<Player, Socket> {
	public abstract create(name: string, data?: Socket): Promise<Player>;
}

export class ExistingPlayerStrategy<
	T extends {
		// Player Manager
		getPlayerById: (sid: string) => Promise<Player>;
		save: (sid: string, player: Player) => void;
		log: (context: string) => void;
	},
	U extends {
		// Room Manager
		all: Room[];
		log: () => void;
		get: (name: string) => Room | undefined;
		has: (name: string) => boolean;
	},
> extends PlayerCreationStrategy {
	public constructor(
		private manager: T,
		private rm: U,
	) {
		super();
	}

	public async create(sessionId: string, socket: Socket): Promise<Player> {
		const player = await this.manager.getPlayerById(sessionId);
		player.connected = true;
		const roomsState = player.roomsState;
		// on remet le player dans ses rooms
		roomsState.forEach((s) => {
			if (s.status !== 'left') {
				// si la room existe encore
				if (this.rm.has(s.name)) {
					const room = this.rm.get(s.name);
					if (room) {
						// si le jeu est demarre
						const allowedStatusRegex = new RegExp(/^(active|ready)$/);
						if (room.gameState && s.status && !allowedStatusRegex.test(s.status)) {
							s.status = `idle`;
						}
						room.save(player.sessionID, player);
						socket.join(s.name);
					}
				} else {
					s.status = `left`;
				}
			}
		});
		this.manager.save(player.sessionID, player);
		this.manager.log(
			`existing player strategy => create: ${player.username}, ${player.sessionID} on socket ${socket.id}`,
		);
		this.rm.log();
		socket.data.player = player;
		return player;
	}
}

export class NewPlayerStrategy<
	T extends {
		getPlayerById: (sid: string) => Promise<Player>;
		save: (sid: string, player: Player) => void;
		log: (context: string) => void;
	},
> extends PlayerCreationStrategy {
	public constructor(private manager: T) {
		super();
	}

	public async create(sessionId: string, socket: Socket): Promise<Player> {
		return await new Promise((resolve) => {
			const username = socket.handshake.auth?.username;
			const player = new Player(username, sessionId);
			this.manager.save(player.sessionID, player);
			this.manager.log(
				`new player strategy => create: ${player.username}, ${player.sessionID} on socket ${socket.id}`,
			);
			socket.data.player = player;
			resolve(player);
		});
	}
}

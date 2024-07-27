import { logger } from '../infra/';
import Player from './Player';

import { PlayerStore } from './stores';

class PlayersManager extends PlayerStore {
	public constructor() {
		super();
		this.getPlayerById = this.getPlayerById.bind(this);
		this.log = this.log.bind(this);
	}

	public getPlayerById(sessionID: string): Promise<Player> {
		return new Promise<Player>((resolve, reject) => {
			const player = this.get(sessionID);
			if (player) {
				resolve(player);
			}
			reject(new Error(`Player ${sessionID} not found`));
		});
	}

	public log(context: string): void {
		const total = this.total;
		const s = total > 1 ? 's' : '';
		const llog = `\n[playercontroller]: (currently registered: ${total} player${s})\n`;
		const log = `\n\x1b[34m[playercontroller ${context}]\x1b[0m
\x1b[4m(currently registered: ${total} player${s})\x1b[0m\n`;
		logger.logContext(llog, 'playercontroller log', log);
		this.all.forEach((player) => {
			player.log(context);
		});
	}
}

export default PlayersManager;
export type PM = PlayersManager;

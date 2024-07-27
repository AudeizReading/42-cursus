import { logger } from '../../infra';
import { TypeAction } from '../GameLogic';
import Player from '../../players/Player';
import { AGameState } from './AGameState';
import { StartedState } from '.';

export class CreatedState extends AGameState {
	public start(): void {
		const id = this.game?.id;
		if (this.game) {
			this.game.transitionTo(new StartedState());
			let log = `Start {CreatedState}: Game ${id} transition to StartedState\n`;

			this.game.gamers.forEach((gamer: Player) => {
				log += `add gamer: ${JSON.stringify(gamer)}\n`;
				this.logic?.addPlayer(gamer);
			});
			logger.logContext(log, `Start {CreatedState}: Game ${id}`, log);
			super.start();
		}
	}

	public play(player: Player, action: TypeAction): void {
		throw new Error(`Game ${this.game?.id} not started [${action}]`);
	}

	public finish(): void {
		throw new Error(`Game ${this.game?.id} not started`);
	}
}

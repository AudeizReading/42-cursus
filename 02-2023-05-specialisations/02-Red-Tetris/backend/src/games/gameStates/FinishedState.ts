import Player from '../../players/Player';
import { TypeAction } from '../GameLogic';
import { AGameState } from './AGameState';

export class FinishedState extends AGameState {
	public start(): void {
		throw new Error(`Game ${this.game?.id} finished`);
	}

	public play(player: Player, action: TypeAction): void {
		throw new Error(`Game ${this.game?.id} finished: [${action}]`);
	}

	public finish(): void {
		throw new Error(`Game ${this.game?.id} finished`);
	}
}

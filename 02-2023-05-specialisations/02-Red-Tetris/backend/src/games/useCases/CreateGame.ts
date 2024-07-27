import { GameCommand } from './GameCommand';
import Room from '../../rooms/Room';
import Game from '../Game';

export class CreateGameCommand extends GameCommand {
	public constructor(protected room: Room) {
		super(room);
	}
	public execute(): Game {
		try {
			return new Game(this.room);
		} catch (e) {
			throw new Error((<Error>e).message);
		}
	}
}

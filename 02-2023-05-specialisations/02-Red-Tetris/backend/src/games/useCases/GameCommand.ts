import Room from '../../rooms/Room';
import Game from '../Game';

export abstract class GameCommand {
	public constructor(protected room: Room) {}
	public abstract execute(): Game | void;
}

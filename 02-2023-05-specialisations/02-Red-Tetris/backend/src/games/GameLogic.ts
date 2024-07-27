import Player from '../players/Player';
import { Map as MapGame } from './Map';
import { ATetriminos } from './tetriminos/ATetriminos';
import { TetriminosFactory } from './tetriminos/TetrimosFactory';
import { TetriminosArrayType } from './tetriminos/tetriminos.interface';

export type TypeAction = 'up' | 'down' | 'left' | 'right' | 'space';
export type SoundEffectType =
	| 'backToBackTetris'
	| 'blockout'
	| 'collapse'
	| 'hardDrop'
	| 'hold'
	| 'inputFailed'
	| 'levelUp'
	| 'lineClear'
	| 'lock'
	| 'move'
	| 'rotate'
	| 'tetris'
	| 'win'
	| undefined;

export class PlayerGame {
	public constructor(
		private readonly player: Player,
		private map: MapGame = new MapGame(),
		private score: number = 0,
		private level: number = 1,
		private soundEffect: SoundEffectType[] = [],
		private lastUpdate: Date = new Date(),
		private totalLine: number = 0,
		private endGame: boolean = false,
	) {}

	public addSoundEffect(sound: SoundEffectType): void {
		this.soundEffect.push(sound);
	}

	public getSoundEffect(): SoundEffectType[] {
		return this.soundEffect;
	}

	public resetSoundEffect(): void {
		this.soundEffect = [];
	}

	public getLevel(): number {
		return this.level;
	}

	public getScore(): number {
		return this.score;
	}

	public addScore(score: number): void {
		this.score += score;
	}

	public getMap(): MapGame {
		return this.map;
	}

	public getPlayer(): Player {
		return this.player;
	}

	public setLastUpdate(date: Date): void {
		this.lastUpdate = date;
	}

	public getLastUpdate(): Date {
		return this.lastUpdate;
	}

	public getSpeed(): number {
		switch (this.level) {
			case 1:
				return 1000;
			case 2:
				return 900;
			case 3:
				return 800;
			case 4:
				return 700;
			case 5:
				return 600;
			case 6:
				return 500;
			case 7:
				return 400;
			case 8:
				return 300;
			case 9:
				return 200;
			default:
				return 100;
		}
	}

	public addNewLine(line: number): void {
		this.totalLine += line;
		const newLevel = Math.floor(this.totalLine / 10) + 1;
		if (this.level != newLevel) {
			this.level = newLevel;
			this.addSoundEffect('levelUp');
		}
		if (line > 0 && line < 4) {
			this.addSoundEffect('lineClear');
		} else if (line == 4) {
			this.addSoundEffect('tetris');
		}
		switch (line) {
			case 1:
				this.score += 40 * this.getLevel();
				break;
			case 2:
				this.score += 100 * this.getLevel();
				break;
			case 3:
				this.score += 600 * this.getLevel();
				break;
			case 4:
				this.score += 1200 * this.getLevel();
				break;
		}
	}

	public addBlockLine(line: number): void {
		if (line - 1 <= 0) return;
		for (let i = 0; i < line - 1; i++) this.getMap().addBlock();
	}

	public getEndGame(): boolean {
		return this.endGame;
	}

	public isEndGame(): void {
		this.endGame = true;
	}
}

export interface IStatePlayer {
	level: number;
	score: number;
	map: TetriminosArrayType;
	nextPiece: TetriminosArrayType;
	soundEffect?: SoundEffectType[];
}

export class GameLogic {
	private players: Record<string, PlayerGame> = {};
	private tetriminos: ATetriminos[] = [];

	public constructor() {
		for (let i = 0; i < 2; i++) this.generateTetriminos();
	}

	private generateTetriminos(): void {
		this.tetriminos.push(TetriminosFactory.generateRandom());
		// this.tetriminos.push(TetriminosFactory.generateI());
	}

	public addPlayer(player: Player): void {
		const playerGame = new PlayerGame(player);
		this.players[player.sessionID] = playerGame;
	}

	public statePlayer(sessionIDorPlayer: string | Player): IStatePlayer {
		const identifiant = typeof sessionIDorPlayer == 'string' ? sessionIDorPlayer : sessionIDorPlayer.sessionID;
		const player = this.players[identifiant];
		const returnValue: IStatePlayer = {
			level: player.getLevel(),
			score: player.getScore(),
			map: player.getMap().render(),
			nextPiece: this.tetriminos[player.getMap().getNbOfTetriminos()].state(),
		};
		if (player.getSoundEffect().length) {
			returnValue.soundEffect = player.getSoundEffect();
		}
		player.resetSoundEffect();
		return returnValue;
	}

	private up(player: PlayerGame): void {
		if (player.getMap().rotate()) player.addSoundEffect('rotate');
		else player.addSoundEffect('lock');
	}

	private down(player: PlayerGame): void {
		const score = player.getMap().down();
		if (score) {
			player.addSoundEffect('move');
			player.addScore(score);
		} else player.addSoundEffect('lock');
	}

	private left(player: PlayerGame): void {
		if (player.getMap().left()) player.addSoundEffect('move');
		else player.addSoundEffect('lock');
	}

	private right(player: PlayerGame): void {
		if (player.getMap().right()) player.addSoundEffect('move');
		else player.addSoundEffect('lock');
	}

	private space(player: PlayerGame): void {
		const score = player.getMap().downMax();
		if (score) {
			player.addSoundEffect('hardDrop');
			player.addScore(score);
		} else player.addSoundEffect('lock');
	}

	private updatePlayer(player: PlayerGame): void {
		if (player.getEndGame()) return;
		const currentDate = new Date();
		if (
			!player.getMap().newPieceIsRequired() &&
			currentDate.getTime() - player.getLastUpdate().getTime() >= player.getSpeed()
		) {
			player.setLastUpdate(currentDate);
			player.getMap().down();
		}
		if (player.getMap().newPieceIsRequired()) {
			try {
				player.getMap().setTetriminos(this.tetriminos[player.getMap().getNbOfTetriminos()]);
			} catch {
				player.isEndGame();
				return;
			}
			player.setLastUpdate(new Date());
		}
		while (Math.abs(player.getMap().getNbOfTetriminos() - this.tetriminos.length) < 2) {
			this.generateTetriminos();
		}
		const newLineCount = player.getMap().clearMap();
		player.addNewLine(newLineCount);
		if (newLineCount - 1 > 0) {
			Object.keys(this.players).forEach((v) => {
				if (v != player.getPlayer().sessionID) {
					this.players[v].addBlockLine(newLineCount);
				}
			});
		}
	}

	public action(identifiantPlayer: string, action: TypeAction): void {
		if (this.players[identifiantPlayer].getEndGame()) return;
		switch (action) {
			case 'up':
				this.up(this.players[identifiantPlayer]);
				break;
			case 'down':
				this.down(this.players[identifiantPlayer]);
				break;
			case 'left':
				this.left(this.players[identifiantPlayer]);
				break;
			case 'right':
				this.right(this.players[identifiantPlayer]);
				break;
			case 'space':
				this.space(this.players[identifiantPlayer]);
				break;
		}
	}

	public update(): void {
		Object.keys(this.players).forEach((v) => this.updatePlayer(this.players[v]));
	}

	public endGame(sessionID: string): PlayerGame {
		const player = this.players[sessionID];
		if (player === undefined) throw new Error('Player not found in GameLogic');
		if (player.getEndGame()) {
			delete this.players[sessionID];
		}
		return player;
	}
}

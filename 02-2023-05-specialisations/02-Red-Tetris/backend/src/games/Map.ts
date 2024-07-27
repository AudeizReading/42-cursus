import { ATetriminos } from 'games/tetriminos/ATetriminos';
import { TetriminosArrayType, TetriminosType } from './tetriminos/tetriminos.interface';

export const X = 10;
export const Y = 20;

export class Map {
	public constructor(
		private map: TetriminosArrayType = [],
		public currentTetriminos: ATetriminos | undefined = undefined,
		private nbOfTetriminos: number = 0,
	) {
		if (this.map.length == 0) {
			for (let i = 0; i < Y; i++) this.map.push(new Array(X).fill(''));
		}
	}

	public resetTetriminos(): void {
		const tetrimino = this.getTetriminos();
		for (let y = tetrimino.getY(), yy = 0; yy < tetrimino.state().length; y++, yy++) {
			for (let x = tetrimino.getX(), xx = 0; xx < tetrimino.state()[0].length; x++, xx++) {
				if (tetrimino.state()[yy][xx] != '') this.map[y][x] = tetrimino.state()[yy][xx];
			}
		}
		this.currentTetriminos = undefined;
	}

	public setTetriminos(tetriminos: ATetriminos): void {
		if (!this.newPieceIsRequired()) {
			throw new Error('Tetriminos is not empty');
		}
		if (!this.moveIsPossible(tetriminos, 0, 0)) {
			throw new Error('Add this tetriminos is not possible');
		}
		this.currentTetriminos = tetriminos.clone();
		this.nbOfTetriminos++;
	}

	public getTetriminos(): ATetriminos {
		if (this.currentTetriminos === undefined) throw new Error('Tetriminos is not defined');
		return this.currentTetriminos;
	}

	public getNbOfTetriminos(): number {
		return this.nbOfTetriminos;
	}

	public newPieceIsRequired(): boolean {
		try {
			this.getTetriminos();
		} catch (err) {
			return true;
		}
		return false;
	}

	public downMax(): number {
		let score = 0;
		while (1) {
			if (this.moveIsPossible(this.getTetriminos(), 1, 0)) {
				try {
					this.getTetriminos().down();
					score += 2;
				} catch {
					break;
				}
			} else {
				break;
			}
		}
		this.resetTetriminos();
		return score;
	}

	public down(): number {
		if (this.moveIsPossible(this.getTetriminos(), 1, 0)) {
			this.getTetriminos().down();
			return 1;
		} else {
			this.resetTetriminos();
			return 0;
		}
	}

	public left(): boolean {
		if (this.moveIsPossible(this.getTetriminos(), 0, -1)) {
			this.getTetriminos().left();
			return true;
		}
		return false;
	}
	public right(): boolean {
		if (this.moveIsPossible(this.getTetriminos(), 0, 1)) {
			this.getTetriminos().right();
			return true;
		}
		return false;
	}
	public rotate(): boolean {
		const original = this.getTetriminos().clone();
		const moveUp = this.getTetriminos().clone();
		const moveDown = this.getTetriminos().clone();
		const moveLeft = this.getTetriminos().clone();
		const moveRight = this.getTetriminos().clone();
		original.rotate();
		moveUp.rotate();
		moveLeft.rotate();
		moveRight.rotate();
		moveDown.rotate();
		if (this.moveIsPossible(original, 0, 0)) {
			this.getTetriminos().rotate();
			return true;
		}
		if (this.moveIsPossible(moveUp, -1, 0)) {
			this.getTetriminos().setY(this.getTetriminos().getY() - 1);
			this.getTetriminos().rotate();
			return true;
		}
		if (this.moveIsPossible(moveLeft, 0, -1)) {
			this.getTetriminos().setX(this.getTetriminos().getX() - 1);
			this.getTetriminos().rotate();
			return true;
		}
		if (this.moveIsPossible(moveRight, 0, 1)) {
			this.getTetriminos().setX(this.getTetriminos().getX() + 1);
			this.getTetriminos().rotate();
			return true;
		}
		if (this.moveIsPossible(moveDown, 1, 0)) {
			this.getTetriminos().setY(this.getTetriminos().getY() + 1);
			this.getTetriminos().rotate();
			return true;
		}
		return false;
	}

	private moveIsPossible(tetrimino: ATetriminos, yChange: number, xChange: number): boolean {
		if (tetrimino == undefined) return false;
		for (let y = tetrimino.getY() + yChange, yy = 0; yy < tetrimino.state().length; y++, yy++) {
			for (let x = tetrimino.getX() + xChange, xx = 0; xx < tetrimino.state()[0].length; x++, xx++) {
				if (tetrimino.state()[yy][xx] == '') continue;
				try {
					if (this.map[y][x] !== '') return false;
				} catch {
					return false;
				}
			}
		}
		return true;
	}

	public render(): TetriminosArrayType {
		const renderMap: TetriminosArrayType = [];
		for (const line of this.map) {
			renderMap.push([...line]);
		}
		try {
			const tetrimino = this.getTetriminos();
			if (tetrimino == undefined) return renderMap;
			for (let y = tetrimino.getY(), yy = 0; yy < tetrimino.state().length; y++, yy++) {
				for (let x = tetrimino.getX(), xx = 0; xx < tetrimino.state()[0].length; x++, xx++) {
					if (tetrimino.state()[yy][xx] != '') renderMap[y][x] = tetrimino.state()[yy][xx];
				}
			}
			return renderMap;
		} catch (error) {
			return renderMap;
		}
	}

	private createEmptyLine(): ''[] {
		const line: ''[] = [];
		for (let x = 0; x < X; x++) line.push('');
		return line;
	}

	public clearMap(): number {
		const lineForRemove: number[] = [];
		for (let y = this.map.length - 1; y >= 0; y--) {
			const line = this.map[y];
			const lineArray = line.filter((v) => v == '' || v == 'G');
			if (lineArray.length == 0) {
				lineForRemove.push(y);
			}
		}
		for (const l of lineForRemove) {
			this.map.splice(l, 1);
		}
		const count = lineForRemove.length;
		for (let i = 0; i < count; i++) {
			this.map.unshift(this.createEmptyLine());
		}
		return count;
	}

	public addBlock(): void {
		const newMap: TetriminosArrayType = [];
		let newLine = -1;
		for (let y = Y - 1; y >= 0; y--) {
			if (this.map[y][0] == 'G') continue;
			newLine = y;
			break;
		}
		for (let y = 0; y < Y; y++) {
			if (y == newLine) {
				newMap.push('G'.repeat(X).split('') as TetriminosType[]);
			} else newMap.push([...this.map[y]]);
		}
		this.map = newMap.map((row) => [...row]);
	}
}

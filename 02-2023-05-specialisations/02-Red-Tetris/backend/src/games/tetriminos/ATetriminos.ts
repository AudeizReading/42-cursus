import { TetriminosArrayType, TetriminosDefaultType, TetriminosType } from './tetriminos.interface';
import { X, Y } from '../Map';

export abstract class ATetriminos {
	protected tetriminos: TetriminosArrayType;
	protected x: number;
	protected y: number;

	protected constructor(
		protected readonly type: TetriminosType,
		protected readonly defaultTetriminos: TetriminosDefaultType,
	) {
		this.tetriminos = this.defineTetriminos();
		this.y = 0;
		this.x = this.state()[0].length == 4 ? 3 : 4;
	}

	private defineTetriminos(): TetriminosArrayType {
		const defaultTetriminos: TetriminosArrayType = [];
		for (const line of this.defaultTetriminos) {
			defaultTetriminos.push(line.map((v) => (v == 1 ? this.type : '')));
		}
		return defaultTetriminos;
	}

	protected rotateMatrix(matrix: TetriminosArrayType): TetriminosArrayType {
		const rows = matrix.length;
		const cols = matrix[0].length;
		const rotatedMatrix: TetriminosArrayType = [];
		for (let i = 0; i < cols; i++) {
			rotatedMatrix.push(new Array(rows).fill(''));
		}
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				rotatedMatrix[j][rows - 1 - i] = matrix[i][j];
			}
		}
		return rotatedMatrix;
	}

	public getX(): number {
		return this.x;
	}

	public getY(): number {
		return this.y;
	}

	public state(): TetriminosArrayType {
		return this.tetriminos;
	}

	public setX(x: number): void {
		this.x = x;
	}

	public setY(y: number): void {
		this.y = y;
	}

	protected fixPosition(): void {
		if (this.x + this.state()[0].length >= X) {
			this.x = X - this.state()[0].length;
		}
		if (this.y + this.state().length >= Y) {
			this.y = Y - this.state().length;
		}
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
	}

	public rotate(): void {
		this.tetriminos = this.rotateMatrix([...this.tetriminos]);
		this.fixPosition();
	}

	public left(): void {
		if (this.x - 1 < 0) throw new Error('Move Left is not possible');
		this.x--;
	}

	public right(): void {
		if (this.x + this.state()[0].length + 1 > X) {
			throw new Error('Move Right is not possible');
		}
		this.x++;
	}

	public down(): void {
		if (this.y + 1 + this.tetriminos.length > Y) {
			throw new Error('Move down is not possible');
		}
		this.y++;
	}

	public abstract clone(): ATetriminos;
}

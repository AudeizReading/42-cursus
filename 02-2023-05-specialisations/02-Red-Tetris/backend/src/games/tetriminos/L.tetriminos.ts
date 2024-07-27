import { ATetriminos } from './ATetriminos';

export class LTetriminos extends ATetriminos {
	public constructor() {
		super('L', [
			[0, 0, 1],
			[1, 1, 1],
		]);
	}

	public clone(): ATetriminos {
		const tetriminos = new LTetriminos();
		tetriminos.setX(this.getX());
		tetriminos.setY(this.getY());
		return tetriminos;
	}
}

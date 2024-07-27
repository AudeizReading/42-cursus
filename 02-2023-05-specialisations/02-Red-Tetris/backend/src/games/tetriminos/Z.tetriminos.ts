import { ATetriminos } from './ATetriminos';

export class ZTetriminos extends ATetriminos {
	public constructor() {
		super('Z', [
			[1, 1, 0],
			[0, 1, 1],
		]);
	}

	public clone(): ATetriminos {
		const tetriminos = new ZTetriminos();
		tetriminos.setX(this.getX());
		tetriminos.setY(this.getY());
		return tetriminos;
	}
}

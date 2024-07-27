import { ATetriminos } from './ATetriminos';

export class STetriminos extends ATetriminos {
	public constructor() {
		super('S', [
			[0, 1, 1],
			[1, 1, 0],
		]);
	}

	public clone(): ATetriminos {
		const tetriminos = new STetriminos();
		tetriminos.setX(this.getX());
		tetriminos.setY(this.getY());
		return tetriminos;
	}
}

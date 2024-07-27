import { ATetriminos } from './ATetriminos';

export class OTetriminos extends ATetriminos {
	public constructor() {
		super('O', [
			[1, 1],
			[1, 1],
		]);
	}

	public clone(): ATetriminos {
		const tetriminos = new OTetriminos();
		tetriminos.setX(this.getX());
		tetriminos.setY(this.getY());
		return tetriminos;
	}
}

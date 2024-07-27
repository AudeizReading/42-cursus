import { ATetriminos } from './ATetriminos';

export class TTetriminos extends ATetriminos {
	public constructor() {
		super('T', [
			[0, 1, 0],
			[1, 1, 1],
		]);
	}

	public clone(): ATetriminos {
		const tetriminos = new TTetriminos();
		tetriminos.setX(this.getX());
		tetriminos.setY(this.getY());
		return tetriminos;
	}
}

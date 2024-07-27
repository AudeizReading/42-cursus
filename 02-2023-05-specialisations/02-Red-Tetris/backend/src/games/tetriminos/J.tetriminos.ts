import { ATetriminos } from './ATetriminos';

export class JTetriminos extends ATetriminos {
	public constructor() {
		super('J', [
			[1, 0, 0],
			[1, 1, 1],
		]);
	}

	public clone(): ATetriminos {
		const tetriminos = new JTetriminos();
		tetriminos.setX(this.getX());
		tetriminos.setY(this.getY());
		return tetriminos;
	}
}

import { ATetriminos } from './ATetriminos';

export class ITetriminos extends ATetriminos {
	private step = 0;

	public constructor() {
		super('I', [[1, 1, 1, 1]]);
	}

	public clone(): ATetriminos {
		const tetriminos = new ITetriminos();
		tetriminos.setX(this.getX());
		tetriminos.setY(this.getY());
		return tetriminos;
	}

	public rotate(): void {
		this.step++;
		if (this.step == 4) this.step = 0;
		this.tetriminos = this.rotateMatrix([...this.tetriminos]);
		switch (this.step) {
			case 1:
				this.x += 2;
				this.y -= 1;
				break;
			case 2:
				this.x -= 2;
				break;
			case 3:
				this.x += 1;
				this.y += 1;
				break;
			case 0:
				this.x -= 1;
				break;
		}
		this.fixPosition();
	}
}

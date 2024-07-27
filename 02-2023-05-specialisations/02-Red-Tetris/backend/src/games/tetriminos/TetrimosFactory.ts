import { ITetriminos } from './I.tetriminos';
import { JTetriminos } from './J.tetriminos';
import { LTetriminos } from './L.tetriminos';
import { OTetriminos } from './O.tetriminos';
import { STetriminos } from './S.tetriminos';
import { TTetriminos } from './T.tetriminos';
import { ATetriminos } from './ATetriminos';
import { ZTetriminos } from './Z.tetriminos';

export class TetriminosFactory {
	private static tetriminos: (() => ATetriminos)[] = [
		TetriminosFactory.generateI,
		TetriminosFactory.generateO,
		TetriminosFactory.generateT,
		TetriminosFactory.generateL,
		TetriminosFactory.generateJ,
		TetriminosFactory.generateZ,
		TetriminosFactory.generateS,
	];

	public static generateI(): ATetriminos {
		return new ITetriminos();
	}
	public static generateO(): ATetriminos {
		return new OTetriminos();
	}
	public static generateT(): ATetriminos {
		return new TTetriminos();
	}
	public static generateL(): ATetriminos {
		return new LTetriminos();
	}
	public static generateJ(): ATetriminos {
		return new JTetriminos();
	}
	public static generateZ(): ATetriminos {
		return new ZTetriminos();
	}
	public static generateS(): ATetriminos {
		return new STetriminos();
	}
	public static generateRandom(): ATetriminos {
		const len: number = this.tetriminos.length;
		const random = Math.floor(Math.random() * len);
		return this.tetriminos[random]();
	}
}

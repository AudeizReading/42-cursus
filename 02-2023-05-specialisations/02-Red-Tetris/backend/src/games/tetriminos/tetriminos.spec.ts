import { describe, it, expect } from '@jest/globals';
import { ATetriminos } from './ATetriminos';
import { ITetriminos } from './I.tetriminos';
import { JTetriminos } from './J.tetriminos';
import { LTetriminos } from './L.tetriminos';
import { OTetriminos } from './O.tetriminos';
import { STetriminos } from './S.tetriminos';
import { TTetriminos } from './T.tetriminos';
import { ZTetriminos } from './Z.tetriminos';
import { TetriminosArrayType } from './tetriminos.interface';
import { X, Y } from '../Map';

const compare = <T>(a: T, b: T): boolean => {
	return JSON.stringify(a) == JSON.stringify(b);
};

describe('Global Tetriminos', () => {
	[
		{
			name: 'I Tetriminos',
			instanceType: ITetriminos,
		},
		{
			name: 'J Tetriminos',
			instanceType: JTetriminos,
		},
		{
			name: 'L Tetriminos',
			instanceType: LTetriminos,
		},
		{
			name: 'O Tetriminos',
			instanceType: OTetriminos,
		},
		{
			name: 'S Tetriminos',
			instanceType: STetriminos,
		},
		{
			name: 'T Tetriminos',
			instanceType: TTetriminos,
		},
		{
			name: 'Z Tetriminos',
			instanceType: ZTetriminos,
		},
	].forEach((v) => {
		describe(v.name, () => {
			let instance: ATetriminos;

			it('Define instance', () => {
				instance = new v.instanceType();
				expect(instance instanceof v.instanceType).toBe(true);
			});

			it('Clone', () => {
				const clone: ATetriminos = instance.clone();
				expect(compare(instance, clone)).toBe(true);
			});
		});
	});
});

describe('ATetriminos for S', () => {
	const fistPosition: TetriminosArrayType = [
		['', 'S', 'S'],
		['S', 'S', ''],
	];
	const secondPositon: TetriminosArrayType = [
		['S', ''],
		['S', 'S'],
		['', 'S'],
	];
	const thirdPosition: TetriminosArrayType = fistPosition;
	const fourthPosition: TetriminosArrayType = secondPositon;

	let instance: ATetriminos;

	it('Define instance', () => {
		instance = new STetriminos();
		expect(instance instanceof STetriminos).toBe(true);
	});

	describe('Rotate', () => {
		it('1st', () => {
			expect(compare(instance.state(), fistPosition)).toBe(true);
		});

		it('2nd', () => {
			instance.rotate();
			expect(compare(instance.state(), secondPositon)).toBe(true);
		});

		it('3rd', () => {
			instance.rotate();
			expect(compare(instance.state(), thirdPosition)).toBe(true);
		});

		it('4th', () => {
			instance.rotate();
			expect(compare(instance.state(), fourthPosition)).toBe(true);
		});

		it('1st', () => {
			instance.rotate();
			expect(compare(instance.state(), fistPosition)).toBe(true);
		});
	});

	describe('Left', () => {
		it('Get x position', () => {
			expect(instance.getX()).toBe(4);
		});

		for (let x = 3; x >= 0; x--) {
			it(`Move left ${x}`, () => {
				instance.left();
				expect(instance.getX()).toBe(x);
			});
		}

		it(`Move left throw error`, () => {
			expect(() => instance.left()).toThrow();
		});
	});

	describe('Right', () => {
		it('Get x position', () => {
			expect(instance.getX()).toBe(0);
		});

		for (let x = 1; x <= X - 3; x++) {
			it(`Move right ${x}`, () => {
				instance.right();
				expect(instance.getX()).toBe(x);
			});
		}

		it(`Move right throw error`, () => {
			expect(() => instance.right()).toThrow();
		});
	});

	describe('down', () => {
		it('Get y position', () => {
			expect(instance.getY()).toBe(0);
		});

		for (let y = 1; y <= Y - 2; y++) {
			it(`Move down ${y}`, () => {
				instance.down();
				expect(instance.getY()).toBe(y);
			});
		}

		it(`Move down throw error`, () => {
			expect(() => instance.down()).toThrow();
		});
	});

	describe('fixPosition', () => {
		it('Define fake position', () => {
			instance.setX(X + 10);
			instance.setY(Y + 10);
			expect(instance.getX()).toBe(X + 10);
			expect(instance.getY()).toBe(Y + 10);
		});

		it('Rotate test', () => {
			instance.rotate();
			expect(instance.getX()).toBe(8);
			expect(instance.getY()).toBe(17);
		});

		it('Define fake position', () => {
			instance.setX(-10);
			instance.setY(-10);
			expect(instance.getX()).toBe(-10);
			expect(instance.getY()).toBe(-10);
		});

		it('Rotate test', () => {
			instance.rotate();
			expect(instance.getX()).toBe(0);
			expect(instance.getY()).toBe(0);
		});
	});
});

describe('I Tetriminos', () => {
	const fistPosition: TetriminosArrayType = [['I', 'I', 'I', 'I']];
	const secondPositon: TetriminosArrayType = [['I'], ['I'], ['I'], ['I']];
	const thirdPosition: TetriminosArrayType = fistPosition;
	const fourthPosition: TetriminosArrayType = secondPositon;

	let instance: ITetriminos;

	it('Define instance', () => {
		instance = new ITetriminos();
		expect(instance instanceof ITetriminos).toBe(true);
	});

	describe('Rotate', () => {
		it('1st', () => {
			expect(compare(instance.state(), fistPosition)).toBe(true);
		});

		it('2nd', () => {
			instance.rotate();
			expect(compare(instance.state(), secondPositon)).toBe(true);
		});

		it('3rd', () => {
			instance.rotate();
			expect(compare(instance.state(), thirdPosition)).toBe(true);
		});

		it('4th', () => {
			instance.rotate();
			expect(compare(instance.state(), fourthPosition)).toBe(true);
		});

		it('1st', () => {
			instance.rotate();
			expect(compare(instance.state(), fistPosition)).toBe(true);
		});
	});
});

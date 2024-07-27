// @ts-nocheck
import { Map } from './Map';
import { ATetriminos } from './tetriminos/ATetriminos';
import { ITetriminos } from './tetriminos/I.tetriminos';
import { STetriminos } from './tetriminos/S.tetriminos';
import { TetriminosArrayType } from './tetriminos/tetriminos.interface';

describe('Map', () => {
	const render: TetriminosArrayType = [
		['', '', '', 'I', 'I', 'I', 'I', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', '', '', ''],
	];
	let instance: Map;

	it('Define instance', () => {
		instance = new Map();
	});

	it('Get tetriminos throw error', () => {
		try {
			instance.getTetriminos();
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty('message');
			expect((err as Error).message).toBe('Tetriminos is not defined');
		}
	});

	it('Set tetriminos valid', () => {
		expect(() => instance.setTetriminos(new ITetriminos())).not.toThrow();
	});

	it('Get tetriminos valid', () => {
		const tetriminos = instance.getTetriminos();
		expect(tetriminos).toBeInstanceOf(ATetriminos);
	});

	it('Get nbOfTetriminos', () => {
		expect(instance.getNbOfTetriminos()).toBe(1);
	});

	it('First render', () => {
		expect(instance.render()).toMatchObject<TetriminosArrayType>(render);
	});

	it('Set tetriminos throw error not required', () => {
		try {
			instance.setTetriminos(new ITetriminos());
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty('message');
			expect((err as Error).message).toBe('Tetriminos is not empty');
		}
	});

	it('Reset tetriminos', () => {
		expect(() => instance.resetTetriminos()).not.toThrow();
	});

	it('Render after reset', () => {
		expect(instance.render()).toMatchObject<TetriminosArrayType>(render);
	});

	it('Set tetriminos throw error not possible set', () => {
		try {
			instance.setTetriminos(new ITetriminos());
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty('message');
			expect((err as Error).message).toBe('Add this tetriminos is not possible');
		}
	});

	describe('Movements', () => {
		const rotate = (name: string): void =>
			describe(`Rotates - ${name}`, () => {
				for (let i = 0; i < 4; i++) {
					it(`Rotate ${i}`, () => {
						expect(instance.rotate()).toBe(true || false);
					});
				}
			});

		const moveLeftRight = (name: string, nb: number): void =>
			describe(`Move ${name}`, () => {
				for (let i = 0; i < nb; i++) {
					it(`${name} true ${i}`, () => {
						expect(instance[name]()).toBe(true);
					});
				}

				it(`${name} false`, () => {
					expect(instance[name]()).toBe(false);
				});
			});

		let tetriminos: ATetriminos;

		it('Define tetriminos and set Tetriminos', () => {
			tetriminos = new ITetriminos();
			tetriminos.setY(10);
			expect(() => instance.setTetriminos(tetriminos)).not.toThrow();
		});

		rotate('default');
		moveLeftRight('left', 3);
		rotate('after Left');
		moveLeftRight('right', 6);
		rotate('After Right');

		it('Move down', () => {
			expect(instance.down()).toBe(1);
		});

		rotate('After down');

		it('Move DownMax', () => {
			expect(instance.downMax()).toBe(16);
		});

		describe('Set new tetriminos', () => {
			let tetriminos: ATetriminos;

			it('Define tetriminos S', () => {
				tetriminos = new STetriminos();
				tetriminos.setX(0);
				tetriminos.setY(16);
				expect(() => instance.setTetriminos(tetriminos)).not.toThrow();
			});

			for (let i = 0; i < 2; i++) {
				it(`Move down ${i}`, () => {
					expect(instance.down()).toBe(1);
				});
			}

			it(`Move down not possible`, () => {
				expect(instance.down()).toBe(0);
			});
		});
	});

	describe('clearMap', () => {
		const fakeMap: TetriminosArrayType = [
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', ''],
			['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I'],
		];
		let instanceClearMap: Map;

		it('Define intance fake Map', () => {
			instanceClearMap = new Map(fakeMap);
			expect(instanceClearMap.render()).toStrictEqual(fakeMap);
		});

		it('clearMap method', () => {
			const lineClear = instanceClearMap.clearMap();
			const emptyMap: TetriminosArrayType = [];
			for (let i = 0; i < 20; i++) emptyMap.push(new Array(10).fill(''));
			expect(lineClear).toBe(1);
			expect(instanceClearMap.render()).toStrictEqual(emptyMap);
		});
	});
});

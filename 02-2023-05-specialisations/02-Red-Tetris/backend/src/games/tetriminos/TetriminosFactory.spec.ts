// @ts-nocheck
import { describe, it, expect } from '@jest/globals';
import { ATetriminos } from './ATetriminos';
import { ITetriminos } from './I.tetriminos';
import { JTetriminos } from './J.tetriminos';
import { LTetriminos } from './L.tetriminos';
import { OTetriminos } from './O.tetriminos';
import { STetriminos } from './S.tetriminos';
import { TTetriminos } from './T.tetriminos';
import { ZTetriminos } from './Z.tetriminos';
import { TetriminosFactory } from './TetrimosFactory';

describe('Tetriminos Factory', () => {
	let instance: TetriminosFactory;
	const tetriminos: ATetriminos[] = [];

	it('Define Instance', () => {
		instance = TetriminosFactory;
		expect(instance == TetriminosFactory).toBe(true);
	});

	[
		{ tetriminosClass: ITetriminos, name: 'generateI' },
		{ tetriminosClass: JTetriminos, name: 'generateJ' },
		{ tetriminosClass: LTetriminos, name: 'generateL' },
		{ tetriminosClass: OTetriminos, name: 'generateO' },
		{ tetriminosClass: STetriminos, name: 'generateS' },
		{ tetriminosClass: TTetriminos, name: 'generateT' },
		{ tetriminosClass: ZTetriminos, name: 'generateZ' },
	].forEach((test) => {
		it(test.name, () => {
			const tetrimino: ATetriminos = instance[test.name]();
			expect(tetrimino instanceof test.tetriminosClass).toBe(true);
			tetriminos.push(tetrimino);
		});
	});

	it('generateRandom', () => {
		const tetrimino: ATetriminos = TetriminosFactory.generateRandom();
		expect(tetrimino instanceof ATetriminos).toBe(true);
		const values = tetriminos.map((v) => JSON.stringify(v));
		expect(values.includes(JSON.stringify(tetrimino))).toBe(true);
	});
});

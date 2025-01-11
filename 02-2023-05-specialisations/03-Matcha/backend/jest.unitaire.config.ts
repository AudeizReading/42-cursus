import configJest from './jest.config';
import type { Config } from 'jest';

const config: Config = {
	...configJest,
	modulePathIgnorePatterns: [
		...configJest.modulePathIgnorePatterns,
		'src/security',
		'test',
	],
	collectCoverageFrom: [
		...configJest.collectCoverageFrom,
		'!src/**/*.guard.ts',
		'!src/**/*.module.ts',
	],
};

export default config;

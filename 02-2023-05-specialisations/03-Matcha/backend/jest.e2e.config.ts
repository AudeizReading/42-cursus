import configJest from './jest.config';
import type { Config } from 'jest';

const config: Config = {
	...configJest,
	modulePathIgnorePatterns: [...configJest.modulePathIgnorePatterns, 'src'],
	collectCoverageFrom: [
		...configJest.collectCoverageFrom,
		'!src/**/*.service.ts',
	],
};
export default config;

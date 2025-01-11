import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const configJest: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	modulePaths: ['.'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: [
		'**/*.(t|j)s',
		'!config/configuration.ts',
		'!jest*.config.ts',
		'!src/**/*.decorator.ts',
		'!src/**/*.schema.ts',
		'!src/**/*.interface.ts',
		'!src/database/*',
		'!test/*',
		'!test/**/*',
	],
	coverageDirectory: './coverage',
	modulePathIgnorePatterns: [
		'coverage',
		'dist',
		'node_modules',
		'template',
		'.eslintrc.js',
		'src/main',
		'fixtures',
	],
	testEnvironment: 'node',
	testTimeout: 60000,
	coverageThreshold: {
		global: {
			statements: 0,
			branches: 0,
			functions: 0,
			lines: 0,
		},
	},
	forceExit: true,
	silent: true,
	detectOpenHandles: true,
};

export default configJest;

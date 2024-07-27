import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	forceExit: true,
	collectCoverage: false,
	collectCoverageFrom: [
		'<rootDir>/src/*.ts',
		'<rootDir>/src/**/*.ts',
		'<rootDir>/src/**/**/*.ts',
		'<rootDir>/src/**/**/**/*.ts',
	],
	coverageDirectory: '<rootDir>/src/tests/coverage-reports/',
	coveragePathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/dist/',
		'<rootDir>/src/docs/',
		'<rootDir>/src/tests/',
		'<rootDir>/src/tests/coverage-reports/',
	],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 70,
			lines: 70,
			statements: 70,
		},
	},
	reporters: ['default', ['github-actions', { silent: false }], 'summary'],
	displayName: {
		name: 'RED-TETRIS Backend',
		color: 'cyan',
	},
	roots: ['<rootDir>/src/'],
	setupFilesAfterEnv: ['<rootDir>/src/tests/utils/expect.ts'],
	injectGlobals: true,
};

export default config;

import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	verbose: true,
	forceExit: true,
	collectCoverage: true,
	collectCoverageFrom: [
		'<rootDir>/src/*.ts',
		'<rootDir>/src/**/*.ts',
		'<rootDir>/src/**/**/*.ts',
		'<rootDir>/src/**/**/**/*.ts',
		'!<rootDir>/src/**/I*.ts',
		'!<rootDir>/src/base/Strategy.ts',
		'!<rootDir>/src/eventsIO/payloads/types/Payloads.ts',
		'!<rootDir>/src/eventsIO/payloads/types/interfaces/*.ts',
		'!<rootDir>/src/**/index.ts',
		'!<rootDir>/src/**/**/index.ts',
		'!<rootDir>/src/**/Base.ts',
		'!<rootDir>/src/**/**/Base.ts',
		'!<rootDir>/src/**/types.ts',
		'!<rootDir>/src/**/**/types.ts',
		'!<rootDir>/src/**/*.interface.ts',
		'!<rootDir>/src/**/**/*.interface.ts',
		'!<rootDir>/src/rooms/events/manager.ts',
	],
	coverageDirectory: '<rootDir>/src/tests/coverage-reports/',
	coveragePathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/dist/',
		'<rootDir>/src/docs/',
		'<rootDir>/src/tests/',
	],
	coverageThreshold: {
		global: {
			branches: 50, // 50
			functions: 70, // 70
			lines: 70, // 70
			statements: 70, // 70
		},
	},
	reporters: ['default', ['github-actions', { silent: false }], 'summary'],
	displayName: {
		name: 'RED-TETRIS Backend',
		color: 'cyan',
	},
	testTimeout: 30000,
	roots: ['<rootDir>/src/'],
	setupFilesAfterEnv: ['<rootDir>/src/tests/utils/expect.ts'],
	injectGlobals: true,
	testSequencer: '<rootDir>/testSequencer.js',
};

export default config;

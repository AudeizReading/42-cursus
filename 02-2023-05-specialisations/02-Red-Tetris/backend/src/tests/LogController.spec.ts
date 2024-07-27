import { logger } from '../infra';

describe('logger', () => {
	test('basic log', (done) => {
		const env = process.env;
		const log = `Hello World! A little look at the env? ${JSON.stringify(env)}`;
		logger.logContext(log, 'LogController.spec.ts', 'basic log');
		done();
	});
});

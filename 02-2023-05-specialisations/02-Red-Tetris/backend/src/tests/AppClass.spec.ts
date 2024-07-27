import { Server as ServerHttp } from 'http';
import { Server as ServerIO } from 'socket.io';
import { App } from '../infra';

const app: App = new App();

describe('App Basic on / off', () => {
	beforeAll((done) => {
		app.start(9999);
		done();
	});
	test('getIoServer', (done) => {
		expect(app.getIoServer()).toBeInstanceOf(ServerIO);
		done();
	});

	test('getHttServer', (done) => {
		expect(app.getHttpServer()).toBeInstanceOf(ServerHttp);
		done();
	});
	afterAll((done) => {
		app.stop();
		done();
	});
});

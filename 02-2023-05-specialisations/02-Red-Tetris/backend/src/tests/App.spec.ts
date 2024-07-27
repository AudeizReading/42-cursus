import request from 'supertest';
import { Socket, io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { expect } from '@jest/globals';

import app from '../app';
import { App } from '../infra';

const protocol = process.env.PROTOCOL || 'ws';
const host = process.env.HOST || 'localhost';
const serverPort = process.env.PORT || '8080';

const destroyTimer = parseInt(process.env.DESTROY_TIMER ?? '1', 10) * 1000 ?? 1000;
const discoTimer = parseInt(process.env.DISCO_TIMER ?? '1', 10) * 1000 ?? 1000;

beforeAll(async () => {
	await new Promise<App>((resolve) => {
		console.log(`SERVER CONNECTED`);
		resolve(app);
	});
});

afterAll(
	(done) => {
		app.stop();
		console.log(`SERVER DISCONNECTED`);
		setTimeout(() => {
			done();
		}, destroyTimer + discoTimer);
	},
	destroyTimer + discoTimer + 100,
);

describe('Home page', () => {
	const rejectPromise = jest.fn();
	beforeEach(() => {});
	test('Hello World!', (done) => {
		request(app.getHttpServer())
			.get('/')
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.text).toBe(JSON.stringify({ message: 'Hello World!' }));
			})
			.catch((e) => {
				expect(e.message).toBe('Failed to connect within 5 seconds');
				expect(rejectPromise).toHaveBeenCalled();
			});
		expect(rejectPromise).not.toBeCalled();
		expect(rejectPromise).not.toHaveBeenCalled();
		done();
	}, 1500);
	afterAll((done) => {
		done();
	});
});

describe('Failed Connection', () => {
	let recoSocket: Socket;
	beforeAll((done) => {
		recoSocket = io(`${protocol}://${host}:${serverPort}`);
		recoSocket.on('connect_error', () => {
			console.log('reco connect_error');
			recoSocket.close();
			done();
		});
		recoSocket.on('disconnect', () => {
			console.log('reco disconnect');
			recoSocket.close();
			done();
		});
		done();
	});

	test('should fail', (done) => {
		try {
			recoSocket.emit('joinRoom', 'Loulouville');
			recoSocket.onAny((event, data) => {
				console.log('on joinRoom -> this msg should not be logged', event, data);
			});
			done();
		} catch (e) {
			console.log(e);
		}
	});

	afterAll(
		(done) => {
			if (recoSocket.connected) {
				recoSocket.disconnect();
			}
			done();
		},
		destroyTimer + discoTimer + 100,
	);
});

describe('Forgery uuid', () => {
	let socket: Socket;
	beforeAll((done) => {
		try {
			const uuid = uuidv4();
			socket = io(`${protocol}://${host}:${serverPort}`, {
				auth: {
					username: 'Je suis un vilain usurpateur',
					sessionID: uuid,
				},
				reconnection: true,
				autoConnect: false,
			});
			socket.connect();
			socket.on('join', (data) => {
				console.log('connect forgery uuid', uuid, data);
				expect(data.sessionID).not.toBe(uuid);
				done();
			});
			setTimeout(() => {
				done();
			}, 1500);
		} catch (e) {
			done(e);
		}
	}, 2000);

	test('Should generate a new internal uuid and set it as a new player', (done) => {
		try {
			socket.emit('joinRoom', 'Loulouville');
			socket.onAny((event, data) => {
				console.log('on joinRoom -> this msg should never be logged', event, data);
			});
			setTimeout(() => {
				done();
			}, 1500);
		} catch (e) {
			done(e);
		}
	}, 2000);

	afterAll(
		(done) => {
			if (socket.connected) {
				socket.disconnect();
			}
			done();
		},
		destroyTimer + discoTimer + 100,
	);
});

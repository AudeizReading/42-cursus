import { HttpServer } from '../infra/';
import request from 'supertest';
import { AddressInfo } from 'net';

function getServerPort(server: HttpServer): number {
	const base = server.getHttpServer();
	const address = base.address() as AddressInfo;
	return address.port;
}

describe('HttpServer Basic Connection Home Page port 4245', () => {
	let server: HttpServer;
	beforeAll((done) => {
		server = new HttpServer();
		done();
	});

	test('Server start', (done) => {
		server.start(4245);
		expect(server.getHttpServer().listening).toBeTruthy();
		done();
	});

	test('Port listening', (done) => {
		expect(getServerPort(server)).toBe(4245);
		done();
	});

	test('Hello World!', (done) => {
		request(server.getHttpServer())
			.get('/')
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.text).toBe(JSON.stringify({ message: 'Hello World!' }));
				done();
			});
	});

	test('Server get Express app', () => {
		expect(server.getExpressApp()).toBeInstanceOf(Function);
		expect(server.getExpressApp()).toHaveProperty('listen');
	});

	test('Server stop', (done) => {
		server.stop();
		expect(server.getHttpServer().listening).toBeFalsy();
		done();
	});
});

describe('HttpServer Basic Connection Home Page default port', () => {
	let server: HttpServer;
	beforeAll((done) => {
		server = new HttpServer();
		done();
	});

	test('Server start', (done) => {
		server.start();
		expect(server.getHttpServer().listening).toBeTruthy();
		done();
	});

	test('Port listening', (done) => {
		expect(getServerPort(server)).toBe(8080);
		done();
	});

	test('Hello World!', (done) => {
		request(server.getHttpServer())
			.get('/')
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.text).toBe(JSON.stringify({ message: 'Hello World!' }));
				done();
			});
	});

	test(`LeaderBoard`, (done) => {
		request(server.getHttpServer())
			.get('/leaderboard')
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body.page).toBe(1);
				expect(response.body.totalPage).toBeDefined();
				expect(response.body.results).toBeDefined();
				done();
			});
	}, 50000);

	test('Server stop', (done) => {
		server.stop();
		expect(server.getHttpServer().listening).toBeFalsy();
		done();
	});
});

describe('HttpServer process.env.PORT', () => {
	let server: HttpServer;
	const oldPort = process.env.PORT;
	beforeAll((done) => {
		delete process.env.PORT;
		server = new HttpServer();
		server.start();
		done();
	});
	afterAll((done) => {
		process.env.PORT = oldPort;
		server.stop();
		done();
	});
	test('Unset process.env.PORT', (done) => {
		console.log('Should be 8080');
		expect(getServerPort(server)).toBe(8080);
		done();
	});
});

describe('HttpServer ERROR', () => {
	let server: HttpServer;
	const oldPort = process.env.PORT;
	beforeAll((done) => {
		delete process.env.PORT;
		server = new HttpServer();
		server.start();
		done();
	});
	afterAll((done) => {
		process.env.PORT = oldPort;
		server.stop();
		done();
	});

	test('Not allowed by cors', (done) => {
		request(server.getHttpServer())
			.get('/')
			.set('Origin', 'http://localhost:4245')
			.then((response) => {
				console.log('then not allowed by cors?', response);
				expect(response.statusCode).toBe(403);
				expect(response.text).toBe(`<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Error</title>
	</head>
	<body>
		<h1>Oops!</h1>
		<p>It seems that something went wrong!</p>
		<p>Contact your administrator if it is not expected.</p>
	</body>
</html>`);
				done();
			});
	});
});

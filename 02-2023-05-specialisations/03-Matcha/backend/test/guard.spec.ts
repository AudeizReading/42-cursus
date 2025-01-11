import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '$app/app.module';
import { UserService } from '$user/user.service';
import { AuthService } from '$auth/auth.service';
import { TokenService } from '$token/token.service';
import { ADatabase } from '$app/database/ADatabase';

describe('Check Guards', () => {
	let app: INestApplication;
	let userService: UserService;
	let authService: AuthService;
	let tokenService: TokenService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
		userService = app.get<UserService>(UserService);
		authService = app.get<AuthService>(AuthService);
		tokenService = app.get<TokenService>(TokenService);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
		expect(authService).toBeDefined();
		expect(tokenService).toBeDefined();
		expect(app).toBeDefined();
	});

	const userFactory = async (
		username: string,
		validMail = false,
	): Promise<UserService> => {
		const email = `${username.toLowerCase().slice(0, 50 - 11)}@example.fr`;
		const user = userService.new({
			username: username,
			hashPassword: UserService.passwordToHash('Password42@'),
			email,
			firstName: 'firstname',
			lastName: 'lastname',
		});
		await user.update();
		if (validMail) {
			user.setValidateEmail(true);
			await user.update();
		}
		return user;
	};

	const corruptedJWT = (jwt: string): string => {
		const data = jwt.split('.');
		const value = JSON.parse(
			Buffer.from(data[1], 'base64').toString('ascii'),
		);
		if (value.id >= 1) {
			value.id++;
		} else {
			value.id--;
		}
		data[1] = Buffer.from(JSON.stringify(value)).toString('base64');
		return data.join('.');
	};

	type Guard = { auth: TestsGuard; notAuth: TestsGuard };
	type Method = 'GET' | 'PUT' | 'POST';
	type TestsGuard = TestGuard[];
	type TestGuard = {
		url: string;
		method: Method;
		compliteUrl?: (param: unknown) => Promise<string> | string;
	};

	const compliteUrlEmailValidate = async (
		user: UserService,
	): Promise<string> => {
		await tokenService.new('validEmail', user);
		return `/${tokenService.getToken()}`;
	};

	const guards: Guard = {
		auth: [
			{
				url: '/profile/me',
				method: 'GET',
			},
		],
		notAuth: [
			{
				url: '/user/changePasswordBytoken',
				method: 'PUT',
			},
			{
				url: '/registration',
				method: 'POST',
			},
			{
				url: '/email/validate',
				method: 'GET',
				compliteUrl: compliteUrlEmailValidate,
			},
			{
				url: '/email/send/recovery',
				method: 'POST',
			},
			{
				url: '/auth/login',
				method: 'POST',
			},
		],
	};

	describe('Not Auth Guard', () => {
		const tests: TestGuard[] = guards.notAuth;
		tests.forEach((test: TestGuard) => {
			describe(`${test.url} (${test.method})`, () => {
				it('Not authorization', async () => {
					const user = await userFactory(
						`${test.url.split('/').join('')}-${
							test.method
						}-not-authorization`,
					);
					const r = request(app.getHttpServer());
					let url = test.url;
					if (test.compliteUrl != undefined) {
						url += await test.compliteUrl(user);
					}
					let response: request.Response;
					switch (test.method) {
						case 'GET':
							response = await r.get(url);
							break;
						case 'POST':
							response = await r.post(url);
							break;
						case 'PUT':
							response = await r.put(url);
							break;
					}
					expect(response.status).not.toBe(401);
				});
			});
			describe(`${test.url} (${test.method})`, () => {
				it('With authorization', async () => {
					const user = await userFactory(
						`${test.url.split('/').join('')}-${
							test.method
						}-with-authorization`,
					);
					const jwt = await authService.getJwt(user);
					const r = request(app.getHttpServer());
					let url = test.url;
					if (test.compliteUrl != undefined) {
						url += await test.compliteUrl(user);
					}
					let response: request.Response;
					switch (test.method) {
						case 'GET':
							response = await r
								.get(url)
								.set(
									'Authorization',
									`Bearer ${jwt.access_token}`,
								);
							break;
						case 'POST':
							response = await r
								.post(url)
								.set(
									'Authorization',
									`Bearer ${jwt.access_token}`,
								);
							break;
						case 'PUT':
							response = await r
								.put(url)
								.set(
									'Authorization',
									`Bearer ${jwt.access_token}`,
								);
							break;
					}
					expect(response.status).toBe(401);
					expect(response.body).toHaveProperty('error');
					expect(response.body).toHaveProperty('message');
					expect(response.body).toHaveProperty('statusCode');
				});
			});
		});
	});

	describe('Auth Guard', () => {
		const tests: TestGuard[] = guards.auth;
		tests.forEach((test: TestGuard) => {
			describe(`${test.url} (${test.method})`, () => {
				it('No Token', async () => {
					const response = await request(app.getHttpServer()).get(
						test.url,
					);
					expect(response.status).toBe(401);
					expect(response.body).toHaveProperty('error');
					expect(response.body).toHaveProperty('message');
					expect(response.body).toHaveProperty('statusCode');
				});
				it('Mail not validated', async () => {
					const user = await userFactory(
						`${test.url.split('/').join('')}-${
							test.method
						}-mail-not-validated`,
					);
					const jwt = await authService.getJwt(user);
					const response = await request(app.getHttpServer())
						.get(test.url)
						.set('Authorization', `Bearer ${jwt.access_token}`);
					expect(response.status).toBe(401);
					expect(response.body).toHaveProperty('error');
					expect(response.body).toHaveProperty('message');
					expect(response.body).toHaveProperty('statusCode');
				});
				it('User valid', async () => {
					const user = await userFactory(
						`${test.url.split('/').join('')}-${
							test.method
						}-user-valid`,
						true,
					);
					const jwt = await authService.getJwt(user);
					const response = await request(app.getHttpServer())
						.get(test.url)
						.set('Authorization', `Bearer ${jwt.access_token}`);
					expect(response.status).not.toBe(401);
				});
				it('Corrupted token', async () => {
					const user = await userFactory(
						`${test.url.split('/').join('')}-${
							test.method
						}-corrupted-token`,
						true,
					);
					const jwt = await authService.getJwt(user);
					const response = await request(app.getHttpServer())
						.get(test.url)
						.set(
							'Authorization',
							`Bearer ${corruptedJWT(jwt.access_token)}`,
						);
					expect(response.status).toBe(401);
					expect(response.body).toHaveProperty('error');
					expect(response.body).toHaveProperty('message');
					expect(response.body).toHaveProperty('statusCode');
				});
			});
		});
	});
});

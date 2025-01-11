import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '$app/app.module';
import { IregistrationUserBody } from '$registration/registration.interface';
import { IJWT } from '$auth/auth.interface';
import { IUser } from '$user/user.interface';
import { ADatabase } from '$app/database/ADatabase';

describe('Registration User, User valid email, User login, User recovery', () => {
	let app: INestApplication;

	beforeEach(async () => {
		await ADatabase.initialize();
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('should be defined', () => {
		expect(app).toBeDefined();
	});

	const user: IregistrationUserBody = {
		username: 'registration-valid-mail-login-password',
		password: 'Password42@',
		email: 'registration-valid-mail-login-password@example.fr',
		firstName: 'firstname',
		lastName: 'lastname',
	};
	let jwt: IJWT;
	let tokenValidMail: string;
	let tokenRecoveryPassword: string;

	it('register user', async () => {
		const consoleSpy = jest.spyOn(console, 'log');
		const response = await request(app.getHttpServer())
			.post('/registration')
			.send(user);
		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('message');
		const mail = consoleSpy.mock.calls;
		consoleSpy.mockRestore();
		const contentMail = mail[2][1];
		contentMail.split('\n').forEach((line: string) => {
			const regex =
				/<a[^>]*href="([A-Za-z0-9\/:-]+)"[^>]*>[A-Za-z0-9 -]+<\/a\s*>/;
			if (regex.test(line)) {
				tokenValidMail = line
					.split('/')
					[
						line.split('/').length > 1
							? line.split('/').length - 2
							: 0
					].split('"')[0];
			}
		});
	}, 60000);

	it('fail register user whith email', async () => {
		const response = await request(app.getHttpServer())
			.post('/registration')
			.send(user);
		expect(response.status).toBe(409);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('fail register user whith username', async () => {
		const response = await request(app.getHttpServer())
			.post('/registration')
			.send(user);
		expect(response.status).toBe(409);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('first login', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send(user);
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject<IJWT>({
			access_token: expect.any(String),
		});
		jwt = response.body;
	}, 60000);

	it('fail get profil', async () => {
		const response = await request(app.getHttpServer())
			.get('/profile/me')
			.set('Authorization', `Bearer ${jwt.access_token}`);
		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('valid email', async () => {
		const response = await request(app.getHttpServer()).get(
			`/email/validate/${tokenValidMail}`,
		);
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject<IJWT>({
			access_token: expect.any(String),
		});
	}, 60000);

	it('Fail valid email', async () => {
		const response = await request(app.getHttpServer()).get(
			`/email/validate/${tokenValidMail}`,
		);
		expect(response.status).toBe(410);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('Fail valid email whith invalidToken', async () => {
		const response = await request(app.getHttpServer()).get(
			`/email/validate/invalidToken`,
		);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('success get profil', async () => {
		const response = await request(app.getHttpServer())
			.get('/profile/me')
			.set('Authorization', `Bearer ${jwt.access_token}`);
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject<IUser>({
			id: expect.any(Number),
			email: expect.any(String),
			username: expect.any(String),
			firstName: expect.any(String),
			lastName: expect.any(String),
			validateEmail: expect.any(Boolean),
			locationType: expect.any(String),
			status: expect.any(String),
			fameRating: expect.any(Number),
		});
	}, 60000);

	it('send recovery password', async () => {
		const consoleSpy = jest.spyOn(console, 'log');
		const response = await request(app.getHttpServer())
			.post('/email/send/recovery')
			.send(user);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message');
		const mail = consoleSpy.mock.calls;
		consoleSpy.mockRestore();
		const contentMail = mail[2][1];
		contentMail.split('\n').forEach((line: string) => {
			const regex =
				/<a[^>]*href="([A-Za-z0-9\/:-]+)"[^>]*>[A-Za-z0-9 -]+<\/a\s*>/;
			if (regex.test(line)) {
				tokenRecoveryPassword = line
					.split('/')
					[
						line.split('/').length > 1
							? line.split('/').length - 2
							: 0
					].split('"')[0];
			}
		});
	}, 60000);

	it('Fail change password width body empty 1 bad request', async () => {
		const response = await request(app.getHttpServer()).put(
			'/user/changePasswordBytoken',
		);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('Fail change password width body empty 2 bad request', async () => {
		const response = await request(app.getHttpServer())
			.put('/user/changePasswordBytoken')
			.send(undefined);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('Fail change password width body empty 3 bad request', async () => {
		const response = await request(app.getHttpServer())
			.put('/user/changePasswordBytoken')
			.send({ undefined });
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('Fail change password width token bad request', async () => {
		const response = await request(app.getHttpServer())
			.put('/user/changePasswordBytoken')
			.send({
				token: tokenRecoveryPassword,
				newPassword: 'password',
			});
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('change password width token', async () => {
		const response = await request(app.getHttpServer())
			.put('/user/changePasswordBytoken')
			.send({
				token: tokenRecoveryPassword,
				newPassword: 'NewPassword42@',
			});
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject<IJWT>({
			access_token: expect.any(String),
		});
	}, 60000);

	it('Fail change password width token Gone', async () => {
		const response = await request(app.getHttpServer())
			.put('/user/changePasswordBytoken')
			.send({
				token: tokenRecoveryPassword,
				newPassword: 'NewPassword42@',
			});
		expect(response.status).toBe(410);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('Fail change password width token invalid', async () => {
		const response = await request(app.getHttpServer())
			.put('/user/changePasswordBytoken')
			.send({
				token: 'invalidToken',
				newPassword: 'NewPassword42@',
			});
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('fail login last password', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send(user);
		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('message');
		expect(response.body).toHaveProperty('statusCode');
	}, 60000);

	it('success login new password', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ username: user.username, password: 'NewPassword42@' });
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject<IJWT>({
			access_token: expect.any(String),
		});
	}, 60000);
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '$app/app.module';
import { IregistrationUserBody } from '$registration/registration.interface';
import { IJWT } from '$auth/auth.interface';
import { assetsFilesPath } from './assets/assets.module';
import { ADatabase } from '$app/database/ADatabase';

describe('Many upload file', () => {
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
	}, 20000);

	const user: IregistrationUserBody = {
		username: 'many-upload-file',
		password: 'Password42@',
		email: 'many-upload-file@example.fr',
		firstName: 'many',
		lastName: 'upload-file',
	};
	let jwt: IJWT;
	let tokenValidMail: string;

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
			if (regex.test(line))
				tokenValidMail = line
					.split('/')
					[
						line.split('/').length > 1
							? line.split('/').length - 2
							: 0
					].split('"')[0];
		});
	}, 20000);

	it('valid email', async () => {
		const response = await request(app.getHttpServer()).get(
			`/email/validate/${tokenValidMail}`,
		);
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject<IJWT>({
			access_token: expect.any(String),
		});
	}, 20000);

	it('first login', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send(user);
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject<IJWT>({
			access_token: expect.any(String),
		});
		jwt = response.body;
	}, 20000);

	it('upload 10 files simultany', async () => {
		const picture = assetsFilesPath.picture[0];
		const responses = [];
		const status = [];
		for (let i = 0; i < 10; i++) {
			responses.push(
				request(app.getHttpServer())
					.post('/file/profile')
					.set('Authorization', `Bearer ${jwt.access_token}`)
					.attach('file', picture)
					.then((res) => {
						status.push(res.status);
					}),
			);
		}
		await Promise.all(responses);
		let count = 0;
		status.forEach((e) => (e == 201 ? count++ : count));
		expect(count).toBe(5);
	}, 30000);
});

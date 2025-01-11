import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserModule } from '$user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '$user/user.service';
import { IregistrationUserBody } from '$app/registration/registration.interface';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import {
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { IJWT } from './auth.interface';
import { TagModule } from '$tag/tag.module';
import { ADatabase } from '$app/database/ADatabase';

describe('AuthService', () => {
	let service: AuthService;
	let userService: UserService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				UserModule,
				JwtModule,
				TagModule,
			],
			providers: [AuthService, UserService, Logger],
		}).compile();

		userService = module.get<UserService>(UserService);
		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
		expect(service).toBeDefined();
	});

	const users: IregistrationUserBody[] = [
		{
			username: 'AuthServiceUser0',
			password: 'Password42@',
			firstName: 'firstname',
			lastName: 'lastname',
			email: 'AuthServiceUser0@example.fr',
		},
	];

	const usersService: UserService[] = [];

	describe('required for test', () => {
		it('Create User for test', async () => {
			usersService.push(
				userService.new({
					...users[0],
					hashPassword: UserService.passwordToHash(users[0].password),
				}),
			);
			await usersService[0].update();
		});
	});

	describe('signIn', () => {
		it('Username undefined', async () => {
			try {
				await service.signIn(undefined, users[0].password);
			} catch (error) {
				expect(error).toBeInstanceOf(UnauthorizedException);
			}
		});

		it('Password undefined', async () => {
			try {
				await service.signIn(users[0].username, undefined);
			} catch (error) {
				expect(error).toBeInstanceOf(UnauthorizedException);
			}
		});

		it('User not found', async () => {
			try {
				await service.signIn('authServiceUser0', 'Not existing');
			} catch (error) {
				expect(error).toBeInstanceOf(UnauthorizedException);
			}
		});

		it('User found bad password', async () => {
			try {
				await service.signIn(users[0].username, 'PPassword42@');
			} catch (error) {
				expect(error).toBeInstanceOf(UnauthorizedException);
			}
		});

		it('Success signIn', async () => {
			expect(
				await service.signIn(users[0].username, users[0].password),
			).toMatchObject<IJWT>({
				access_token: expect.any(String),
			});
		});
	});

	describe('getJwt', () => {
		it('UserService undefined', async () => {
			try {
				await service.getJwt(undefined);
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				return;
			}
			throw new Error();
		});

		it('UserService user in not in db', async () => {
			try {
				await service.getJwt(new UserService());
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				return;
			}
			throw new Error();
		});

		it('Success get JWT', async () => {
			expect(await service.getJwt(usersService[0])).toMatchObject<IJWT>({
				access_token: expect.any(String),
			});
		});
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { RegistrationModule } from '$registration/registration.module';
import { TokenModule } from '$token/token.module';
import { AuthModule } from '$auth/auth.module';
import { UserService } from './user.service';
import { TokenService } from '$token/token.service';
import { BadRequestException, GoneException, Logger } from '@nestjs/common';
import { IJWT } from '$auth/auth.interface';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { TagModule } from '$tag/tag.module';
import { JwtModule } from '@nestjs/jwt';
import { ADatabase } from '$app/database/ADatabase';

describe('UserController', () => {
	let controller: UserController;
	let userService: UserService;
	let tokenService: TokenService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule,
				ConfigModule.forRoot({
					load: [configuration],
				}),
				RegistrationModule,
				TokenModule,
				AuthModule,
				TagModule,
			],
			providers: [UserService, TokenService, Logger],
			controllers: [UserController],
		}).compile();

		userService = module.get<UserService>(UserService);
		tokenService = module.get<TokenService>(TokenService);
		controller = module.get<UserController>(UserController);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
		expect(tokenService).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('changePasswordByToken', () => {
		let token: TokenService;
		let user: UserService;
		it('Create User', async () => {
			user = userService.new({
				username: `changePasswordByToken-CU`,
				hashPassword: UserService.passwordToHash('Password42@'),
				firstName: 'firstname',
				lastName: 'lastname',
				email: `changePasswordByToken-CU@example.fr`,
			});
			await user.update();
		});
		it('Create Token', async () => {
			token = await tokenService.new('recoveryPassword', user);
		});
		it('undefined newPasword', async () => {
			const body = {
				token: token.getToken(),
				newPassword: undefined,
			};
			try {
				await controller.changePasswordByToken(body);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('message');
				expect(error.response).toHaveProperty('statusCode');
			}
		});
		it('undefined token', async () => {
			const body = {
				token: undefined,
				newPassword: 'NewPassword42@',
			};
			try {
				await controller.changePasswordByToken(body);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('message');
				expect(error.response).toHaveProperty('statusCode');
			}
		});
		it('undefined', async () => {
			try {
				await controller.changePasswordByToken(undefined);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('message');
				expect(error.response).toHaveProperty('statusCode');
			}
		});
		it('invalid newPassword', async () => {
			const body = {
				token: token.getToken(),
				newPassword: 'password',
			};
			try {
				await controller.changePasswordByToken(body);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('message');
				expect(error.response).toHaveProperty('statusCode');
			}
		});
		it('invalid Token', async () => {
			const body = {
				token: 'Invalid',
				newPassword: 'NewPassword42@',
			};
			try {
				await controller.changePasswordByToken(body);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('message');
				expect(error.response).toHaveProperty('statusCode');
			}
		});
		it('invalid', async () => {
			const body = {
				token: 'Invalid',
				newPassword: 'Invalid',
			};
			try {
				await controller.changePasswordByToken(body);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('message');
				expect(error.response).toHaveProperty('statusCode');
			}
		});
		it('valid', async () => {
			const body = {
				token: token.getToken(),
				newPassword: 'NewPassword42@',
			};
			const result = await controller.changePasswordByToken(body);
			expect(result).toMatchObject<IJWT>({
				access_token: expect.any(String),
			});
		});
		it('Gone', async () => {
			const body = {
				token: token.getToken(),
				newPassword: 'NewPassword42@',
			};
			try {
				await controller.changePasswordByToken(body);
			} catch (error) {
				expect(error).toBeInstanceOf(GoneException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('message');
				expect(error.response).toHaveProperty('statusCode');
			}
		});
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from '$security/auth.guard';
import { UserModule } from '$user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import {
	BadRequestException,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { RegistrationController } from '$registration/registration.controller';
import { RegistrationModule } from '$registration/registration.module';
import { EmailModule } from '$email/email.module';
import { TokenModule } from '$token/token.module';
import configuration from '$config/configuration';
import { IJWT, ILogin } from './auth.interface';
import { ADatabase } from '$app/database/ADatabase';

describe('AuthController', () => {
	let controller: AuthController;
	let registrationController: RegistrationController;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				RegistrationModule,
				EmailModule,
				TokenModule,
				UserModule,
				JwtModule,
			],
			controllers: [AuthController, RegistrationController],
			providers: [AuthService, AuthGuard, Logger],
		}).compile();
		registrationController = module.get<RegistrationController>(
			RegistrationController,
		);
		controller = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(registrationController).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('signIn', () => {
		describe('BadRequestException', () => {
			it('undefined', async () => {
				try {
					await controller.signIn(undefined);
				} catch (error) {
					expect(error).toBeInstanceOf(BadRequestException);
					expect(error.response).toHaveProperty('error');
					expect(error.response).toHaveProperty('statusCode');
					expect(error.response).toHaveProperty('message');
				}
			});

			it('username undefined', async () => {
				try {
					await controller.signIn({ password: 'password' } as ILogin);
				} catch (error) {
					expect(error).toBeInstanceOf(BadRequestException);
					expect(error.response).toHaveProperty('error');
					expect(error.response).toHaveProperty('statusCode');
					expect(error.response).toHaveProperty('message');
				}
			});

			it('password undefined', async () => {
				try {
					await controller.signIn({ username: 'username' } as ILogin);
				} catch (error) {
					expect(error).toBeInstanceOf(BadRequestException);
					expect(error.response).toHaveProperty('error');
					expect(error.response).toHaveProperty('statusCode');
					expect(error.response).toHaveProperty('message');
				}
			});
		});

		describe('Success Login', () => {
			it('Create User', async () => {
				await registrationController.registrationUser({
					username: 'test-Success-Login-signIn-auth',
					password: 'Password42@',
					firstName: 'firstname',
					lastName: 'lastname',
					email: 'test-Success-Login-signIn-auth@example.fr',
				});
			});
			it('User Valid', async () => {
				const result = await controller.signIn({
					username: 'test-Success-Login-signIn-auth',
					password: 'Password42@',
				});
				expect(result).toMatchObject<IJWT>({
					access_token: expect.any(String),
				});
			});
		});

		describe('UnauthorizedException', () => {
			it('invalid username', async () => {
				try {
					await controller.signIn({
						username: 'notvalid',
						password: 'Password42@',
					});
				} catch (error) {
					expect(error).toBeInstanceOf(UnauthorizedException);
					expect(error.response).toHaveProperty('error');
					expect(error.response).toHaveProperty('statusCode');
					expect(error.response).toHaveProperty('message');
				}
			});

			it('valid user with bad password', async () => {
				try {
					await controller.signIn({
						username: 'test-Success-Login-signIn-auth',
						password: 'bad password',
					});
				} catch (error) {
					expect(error).toBeInstanceOf(UnauthorizedException);
					expect(error.response).toHaveProperty('error');
					expect(error.response).toHaveProperty('statusCode');
					expect(error.response).toHaveProperty('message');
				}
			});
		});
	});
});

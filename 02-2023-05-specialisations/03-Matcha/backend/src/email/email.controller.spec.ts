import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { TokenModule } from '$token/token.module';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { AuthModule } from '$auth/auth.module';
import { UserModule } from '$user/user.module';
import configuration from '$config/configuration';
import { UserService } from '$user/user.service';
import { TokenService } from '$token/token.service';
import { BadRequestException, GoneException, Logger } from '@nestjs/common';
import { IJWT } from '$auth/auth.interface';
import { TagModule } from '$tag/tag.module';
import { ADatabase } from '$app/database/ADatabase';

describe('EmailController', () => {
	let controller: EmailController;
	let userService: UserService;
	let tokenService: TokenService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				TokenModule,
				ConfigModule,
				AuthModule,
				UserModule,
				TagModule,
			],
			providers: [EmailService, UserService, TokenService, Logger],
			controllers: [EmailController],
		}).compile();

		userService = module.get<UserService>(UserService);
		tokenService = module.get<TokenService>(TokenService);
		controller = module.get<EmailController>(EmailController);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
		expect(tokenService).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('validate', () => {
		let user: UserService;
		let token: TokenService;
		it('Create User', async () => {
			user = userService.new({
				username: `EmailController-validate-CU`,
				hashPassword: UserService.passwordToHash('Password42@'),
				firstName: 'firstname',
				lastName: 'lastname',
				email: `EmailController-validate-CU@example.fr`,
			});
			await user.update();
		});
		it('Create Token', async () => {
			token = await tokenService.new('validEmail', user);
		});
		it('Bad Request undefined', async () => {
			try {
				await controller.validate(undefined);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('statusCode');
				expect(error.response).toHaveProperty('message');
			}
		});
		it('Bad Request not valid', async () => {
			try {
				await controller.validate('Not Valid Token');
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('statusCode');
				expect(error.response).toHaveProperty('message');
			}
		});
		it('Valid', async () => {
			const result = await controller.validate(token.getToken());
			expect(result).toMatchObject<IJWT>({
				access_token: expect.any(String),
			});
		});
		it('Gone', async () => {
			try {
				await controller.validate(token.getToken());
			} catch (error) {
				expect(error).toBeInstanceOf(GoneException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('statusCode');
				expect(error.response).toHaveProperty('message');
			}
		});
	});

	describe('recoveryPassword', () => {
		let user: UserService;
		it('Create User', async () => {
			user = userService.new({
				username: `EmailController-recoveryPassword-CU`,
				hashPassword: UserService.passwordToHash('Password42@'),
				firstName: 'firstname',
				lastName: 'lastname',
				email: `EmailController-recoveryPassword-CU@example.fr`,
			});
			await user.update();
		});
		it('Bad Request', async () => {
			try {
				const body = {
					email: 'notValid@example.fr',
				};
				await controller.recoveryPassword(body);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('statusCode');
				expect(error.response).toHaveProperty('message');
			}
		});
		it('Valid', async () => {
			const body = {
				email: user.getEmail(),
			};
			const result = await controller.recoveryPassword(body);
			expect(result).toHaveProperty('message');
		});
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '$user/user.service';
import { TokenService } from '$token/token.service';
import configuration from '$config/configuration';
import { ADatabase } from '$app/database/ADatabase';

describe('EmailService', () => {
	let service: EmailService;
	let userService: UserService;
	let tokenService: TokenService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				ConfigModule,
			],
			providers: [EmailService, UserService, TokenService],
		}).compile();

		userService = module.get<UserService>(UserService);
		tokenService = module.get<TokenService>(TokenService);
		service = module.get<EmailService>(EmailService);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
		expect(tokenService).toBeDefined();
		expect(service).toBeDefined();
	});

	describe('Send Template', () => {
		describe('sendWelcomeMail', () => {
			let token: TokenService;
			let user: UserService;
			it('Create User', async () => {
				user = userService.new({
					username: `sendWelcomeMail-CU`,
					hashPassword: UserService.passwordToHash('Password42@'),
					firstName: 'firstname',
					lastName: 'lastname',
					email: `sendWelcomeMail-CU@example.fr`,
				});
				await user.update();
			});
			it('Create Token', async () => {
				token = await tokenService.new('validEmail', user);
			});
			it('UserService undefined', async () => {
				try {
					await service.sendWelcomeMail(undefined, token);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('TokenService undefined', async () => {
				try {
					await service.sendWelcomeMail(user, undefined);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('Undefined', async () => {
				try {
					await service.sendWelcomeMail(undefined, undefined);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('UserService invalid', async () => {
				try {
					await service.sendWelcomeMail(new UserService(), token);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('TokenService invalid', async () => {
				try {
					await service.sendWelcomeMail(user, new TokenService());
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('Invalid', async () => {
				try {
					await service.sendWelcomeMail(
						new UserService(),
						new TokenService(),
					);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('Success send template', () => {
				expect(() => {
					service.sendWelcomeMail(user, token);
				}).not.toThrow();
			});
		});

		describe('sendRecoveryPasswordMail', () => {
			let token: TokenService;
			let user: UserService;
			it('Create User', async () => {
				user = userService.new({
					username: `sendRecoveryPasswordMail-CU`,
					hashPassword: UserService.passwordToHash('Password42@'),
					firstName: 'firstname',
					lastName: 'lastname',
					email: `sendRecoveryPasswordMail-CU@example.fr`,
				});
				await user.update();
			});
			it('Create Token', async () => {
				token = await tokenService.new('recoveryPassword', user);
			});
			it('UserService undefined', async () => {
				try {
					await service.sendRecoveryPasswordMail(undefined, token);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('TokenService undefined', async () => {
				try {
					await service.sendRecoveryPasswordMail(user, undefined);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('Undefined', async () => {
				try {
					await service.sendRecoveryPasswordMail(
						undefined,
						undefined,
					);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('UserService invalid', async () => {
				try {
					await service.sendRecoveryPasswordMail(
						new UserService(),
						token,
					);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('TokenService invalid', async () => {
				try {
					await service.sendRecoveryPasswordMail(
						user,
						new TokenService(),
					);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('Invalid', async () => {
				try {
					await service.sendRecoveryPasswordMail(
						new UserService(),
						new TokenService(),
					);
				} catch (error) {
					expect(() => {
						throw error;
					}).toThrow();
				}
			});
			it('Success send template', () => {
				expect(() => {
					service.sendRecoveryPasswordMail(user, token);
				}).not.toThrow();
			});
		});
	});
});

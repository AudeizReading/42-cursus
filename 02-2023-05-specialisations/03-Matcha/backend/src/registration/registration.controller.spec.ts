import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { UserModule } from '$user/user.module';
import { EmailModule } from '$email/email.module';
import { TokenModule } from '$token/token.module';
import { IregistrationUserBody } from './registration.interface';
import { BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { ADatabase } from '$app/database/ADatabase';

describe('RegistrationController', () => {
	let controller: RegistrationController;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				UserModule,
				EmailModule,
				TokenModule,
			],
			providers: [RegistrationService, Logger],
			controllers: [RegistrationController],
		}).compile();

		controller = module.get<RegistrationController>(RegistrationController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('registrationUser', () => {
		const userValid: IregistrationUserBody = {
			username: 'registrationUser',
			firstName: 'firstname',
			lastName: 'lastname',
			email: 'registrationUser@example.fr',
			password: 'Password42@',
		};
		const userInvalid: IregistrationUserBody = {
			username: 'registrationUser2',
			firstName: 'firstname',
			lastName: 'lastname',
			email: 'example@example.42.fr',
			password: 'password',
		};
		it('Created', async () => {
			await expect(
				controller.registrationUser(userValid),
			).resolves.toHaveProperty('message');
		});

		it('Conflict', async () => {
			try {
				await controller.registrationUser(userValid);
			} catch (error) {
				expect(error).toBeInstanceOf(ConflictException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('statusCode');
				expect(error.response).toHaveProperty('message');
			}
		});

		it('Bad Request', async () => {
			try {
				await controller.registrationUser(userInvalid);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('statusCode');
				expect(error.response).toHaveProperty('message');
			}
		});
	});
});

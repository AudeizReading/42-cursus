import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationService } from './registration.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('RegistrationService', () => {
	let service: RegistrationService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [RegistrationService],
		}).compile();

		service = module.get<RegistrationService>(RegistrationService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getErrorBody', () => {
		const emailValid = [
			'bryan.ledda.dev@gmail.com',
			'Bryan.ledda.dev@gMail.com',
			'bledda@student.42nice.fr',
			'bleDDa@student.42nIce.fr',
			'example@example.fr',
			'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee@eee.ee',
			'eee@eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.ee',
		];

		const emailInvalid = [
			'exa @example.fr',
			'a@a.a',
			'example+matcha@gmail.com',
			'email',
			'@email.fr',
			'email@',
			'example#example.com',
			'a@gmail.com',
			'example@g.com',
			'example@.com',
			'example@gmail',
			'example@gmail.',
			'example@gmail.c',
			'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee@eee.ee',
			'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee@ee.ee',
			'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee@eee.e',
			'eee@eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee@eee.e',
			'ee@eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.ee',
			'léa@gmail.com',
		];

		const usernameValid = [
			'username',
			'G@mer06',
			'Étalon sauvage',
			'Etalon Sauvage',
			'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			'Master_of_cheef',
			'Master_of_cheef-',
			'Oui-Oui',
		];

		const usernameInvalid = [
			'p+1',
			'S#arah',
			'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			'👉',
			"Keen'v",
			'Keen"v',
		];

		const firstNameValid = [
			'Bryan',
			'Jean-Michel',
			'lea',
			'léa',
			'lèa',
			'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		];

		const firstNameInvalid = [
			'a',
			'Bry@n',
			'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		];

		const lastNameValid = [
			'ledda',
			'delaporte',
			'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			'êcurier',
			'Van Laeken',
			'de Ménibus',
			'de Marliave',
		];

		const lastNameInvalid = [
			'bgdu06',
			'm@sterofcheef',
			'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		];

		const passwordValid = [
			'Password121@',
			'A1!aaaaa',
			'E#1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		];

		const passwordInvalid = [
			'password',
			'aaaaaaaa',
			'E#1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			'Password',
			'password1',
			'password@',
			'password1@',
			'Password1',
			'Password@',
		];

		describe('undefined', () => {
			const email = {
				email: undefined,
				username: 'username',
				firstName: 'firstname',
				lastName: 'lastname',
				password: 'Password121@',
			};
			const username = {
				email: 'example@example.fr',
				username: undefined,
				firstName: 'firstname',
				lastName: 'lastname',
				password: 'Password121@',
			};
			const firstname = {
				email: 'example@example.fr',
				username: 'username',
				firstName: undefined,
				lastName: 'lastname',
				password: 'Password121@',
			};
			const lastname = {
				email: 'example@example.fr',
				username: 'username',
				firstName: 'firstname',
				lastName: undefined,
				password: 'Password121@',
			};
			const password = {
				email: 'example@example.fr',
				username: 'username',
				firstName: 'firstname',
				lastName: 'lastname',
				password: undefined,
			};
			it('all', () => {
				const result = service.getErrorBody(undefined);
				expect(result).toHaveProperty('email');
				expect(result).toHaveProperty('username');
				expect(result).toHaveProperty('firstName');
				expect(result).toHaveProperty('lastName');
				expect(result).toHaveProperty('password');
			});
			it('mail', () => {
				const result = service.getErrorBody(email);
				expect(result).toHaveProperty('email');
				expect(result).not.toHaveProperty('username');
				expect(result).not.toHaveProperty('firstName');
				expect(result).not.toHaveProperty('lastName');
				expect(result).not.toHaveProperty('password');
			});
			it('username', () => {
				const result = service.getErrorBody(username);
				expect(result).not.toHaveProperty('email');
				expect(result).toHaveProperty('username');
				expect(result).not.toHaveProperty('firstName');
				expect(result).not.toHaveProperty('lastName');
				expect(result).not.toHaveProperty('password');
			});
			it('firstname', () => {
				const result = service.getErrorBody(firstname);
				expect(result).not.toHaveProperty('email');
				expect(result).not.toHaveProperty('username');
				expect(result).toHaveProperty('firstName');
				expect(result).not.toHaveProperty('lastName');
				expect(result).not.toHaveProperty('password');
			});
			it('lastname', () => {
				const result = service.getErrorBody(lastname);
				expect(result).not.toHaveProperty('email');
				expect(result).not.toHaveProperty('username');
				expect(result).not.toHaveProperty('firstName');
				expect(result).toHaveProperty('lastName');
				expect(result).not.toHaveProperty('password');
			});
			it('password', () => {
				const result = service.getErrorBody(password);
				expect(result).not.toHaveProperty('email');
				expect(result).not.toHaveProperty('username');
				expect(result).not.toHaveProperty('firstName');
				expect(result).not.toHaveProperty('lastName');
				expect(result).toHaveProperty('password');
			});
		});

		describe('email', () => {
			describe('valid', () => {
				emailValid.forEach((email) => {
					it(email, () => {
						const result = service.getErrorBody({
							email,
							username: 'username',
							firstName: 'firstname',
							lastName: 'lastname',
							password: 'Password121@',
						});
						expect(result).not.toHaveProperty('email');
						expect(result).not.toHaveProperty('username');
						expect(result).not.toHaveProperty('firstName');
						expect(result).not.toHaveProperty('lastName');
						expect(result).not.toHaveProperty('password');
					});
				});
			});

			describe('invalid', () => {
				emailInvalid.forEach((email) => {
					it(email, () => {
						const result = service.getErrorBody({
							email,
							username: 'username',
							firstName: 'firstname',
							lastName: 'lastname',
							password: 'Password121@',
						});
						expect(result).toHaveProperty('email');
						expect(result).not.toHaveProperty('username');
						expect(result).not.toHaveProperty('firstName');
						expect(result).not.toHaveProperty('lastName');
						expect(result).not.toHaveProperty('password');
					});
				});
			});
		});

		describe('username', () => {
			describe('valid', () => {
				usernameValid.forEach((username) => {
					it(username, () => {
						const result = service.getErrorBody({
							email: 'example@example.fr',
							username,
							firstName: 'firstname',
							lastName: 'lastname',
							password: 'Password121@',
						});
						expect(result).not.toHaveProperty('email');
						expect(result).not.toHaveProperty('username');
						expect(result).not.toHaveProperty('firstName');
						expect(result).not.toHaveProperty('lastName');
						expect(result).not.toHaveProperty('password');
					});
				});
			});

			describe('invalid', () => {
				usernameInvalid.forEach((username) => {
					it(username, () => {
						const result = service.getErrorBody({
							email: 'example@example.fr',
							username,
							firstName: 'firstname',
							lastName: 'lastname',
							password: 'Password121@',
						});
						expect(result).not.toHaveProperty('email');
						expect(result).toHaveProperty('username');
						expect(result).not.toHaveProperty('firstName');
						expect(result).not.toHaveProperty('lastName');
						expect(result).not.toHaveProperty('password');
					});
				});
			});
		});

		describe('firstname', () => {
			describe('valid', () => {
				firstNameValid.forEach((firstName) => {
					it(firstName, () => {
						const result = service.getErrorBody({
							email: 'example@example.fr',
							username: 'username',
							firstName,
							lastName: 'lastname',
							password: 'Password121@',
						});
						expect(result).not.toHaveProperty('email');
						expect(result).not.toHaveProperty('username');
						expect(result).not.toHaveProperty('firstName');
						expect(result).not.toHaveProperty('lastName');
						expect(result).not.toHaveProperty('password');
					});
				});
			});

			describe('invalid', () => {
				firstNameInvalid.forEach((firstName) => {
					it(firstName, () => {
						const result = service.getErrorBody({
							email: 'example@example.fr',
							username: 'username',
							firstName,
							lastName: 'lastname',
							password: 'Password121@',
						});
						expect(result).not.toHaveProperty('email');
						expect(result).not.toHaveProperty('username');
						expect(result).toHaveProperty('firstName');
						expect(result).not.toHaveProperty('lastName');
						expect(result).not.toHaveProperty('password');
					});
				});
			});
		});

		describe('lastname', () => {
			describe('valid', () => {
				lastNameValid.forEach((lastName) => {
					it(lastName, () => {
						const result = service.getErrorBody({
							email: 'example@example.fr',
							username: 'username',
							firstName: 'firstname',
							lastName,
							password: 'Password121@',
						});
						expect(result).not.toHaveProperty('email');
						expect(result).not.toHaveProperty('username');
						expect(result).not.toHaveProperty('firstName');
						expect(result).not.toHaveProperty('lastName');
						expect(result).not.toHaveProperty('password');
					});
				});
			});

			describe('invalid', () => {
				lastNameInvalid.forEach((lastName) => {
					it(lastName, () => {
						const result = service.getErrorBody({
							email: 'example@example.fr',
							username: 'username',
							firstName: 'firstname',
							lastName,
							password: 'Password121@',
						});
						expect(result).not.toHaveProperty('email');
						expect(result).not.toHaveProperty('username');
						expect(result).not.toHaveProperty('firstName');
						expect(result).toHaveProperty('lastName');
						expect(result).not.toHaveProperty('password');
					});
				});
			});
		});

		describe('password', () => {
			describe('valid', () => {
				passwordValid.forEach((password) => {
					it(password, () => {
						const result = service.getErrorBody({
							email: 'example@example.fr',
							username: 'username',
							firstName: 'firstname',
							lastName: 'lastname',
							password,
						});
						expect(result).not.toHaveProperty('email');
						expect(result).not.toHaveProperty('username');
						expect(result).not.toHaveProperty('firstName');
						expect(result).not.toHaveProperty('lastName');
						expect(result).not.toHaveProperty('password');
					});
				});
			});

			describe('invalid', () => {
				passwordInvalid.forEach((password) => {
					it(password, () => {
						const result = service.getErrorBody({
							email: 'example@example.fr',
							username: 'username',
							firstName: 'firstname',
							lastName: 'lastname',
							password,
						});
						expect(result).not.toHaveProperty('email');
						expect(result).not.toHaveProperty('username');
						expect(result).not.toHaveProperty('firstName');
						expect(result).not.toHaveProperty('lastName');
						expect(result).toHaveProperty('password');
					});
				});
			});
		});
	});
});

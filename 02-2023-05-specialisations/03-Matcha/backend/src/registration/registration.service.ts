import { Injectable } from '@nestjs/common';
import {
	IgetErrorBodyReturn,
	IregistrationUserBody,
} from './registration.interface';

@Injectable()
export class RegistrationService {
	static emailIsValid(email: string): boolean {
		if (email == undefined || email.length > 50 || email.length < 10)
			return false;
		return /^[0-9a-z.-]{3,}\@[0-9a-z.-]{3,}\.[a-z]{2,}$/i.test(email);
	}

	static passwordIsValid(password: string): boolean {
		if (password == undefined) return false;
		return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,50}$/.test(
			password,
		);
	}

	static nameIsValid(name: string): boolean {
		if (name == undefined) return false;
		return /^[a-z-À-ÖØ-öø-ÿ ]{3,50}$/i.test(name);
	}

	static usernameIsValid(username: string): boolean {
		if (username == undefined) return false;
		return /^[-a-z_0-9@ À-ÖØ-öø-ÿ]{3,50}$/i.test(username);
	}

	getErrorBody(body: IregistrationUserBody): IgetErrorBodyReturn {
		const errors: IgetErrorBodyReturn = {};
		if (!RegistrationService.emailIsValid(body?.email)) {
			errors.email = [`'${body?.email}' is invalid email`];
		}
		if (!RegistrationService.usernameIsValid(body?.username)) {
			errors.username = [`'${body?.username}' is invalid username`];
		}
		if (!RegistrationService.nameIsValid(body?.firstName)) {
			errors.firstName = [`'${body?.firstName}' is invalid first name`];
		}
		if (!RegistrationService.nameIsValid(body?.lastName)) {
			errors.lastName = [`'${body?.lastName}' is invalid last name`];
		}
		if (!RegistrationService.passwordIsValid(body?.password)) {
			errors.password = [`This password is invalid`];
		}
		return errors;
	}
}

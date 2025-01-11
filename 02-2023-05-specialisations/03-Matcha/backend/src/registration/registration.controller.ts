import {
	BadRequestException,
	Body,
	ConflictException,
	InternalServerErrorException,
	Logger,
	Post,
} from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { UserService } from '$user/user.service';
import { EmailService } from '$email/email.service';
import { TokenService } from '$token/token.service';
import { Api } from './registration.decorator';
import {
	IregistrationUserBody,
	IregistrationUserReturn,
} from './registration.interface';
import { UseGuards } from '$security/security.decorator';
import { Controller } from '$app/app.decorator';

@Controller('registration')
export class RegistrationController {
	constructor(
		private readonly registrationService: RegistrationService,
		private readonly userService: UserService,
		private readonly emailService: EmailService,
		private readonly tokenService: TokenService,
		private readonly loggerService: Logger,
	) {}

	@Api('registrationUser')
	@UseGuards('notAuth')
	@Post()
	async registrationUser(
		@Body() body: IregistrationUserBody,
	): Promise<IregistrationUserReturn> {
		const successMessage = [
			'Check your inbox and spam folder. ',
			'We have sent you an email to validate your registration.',
		].join('');
		const errors = this.registrationService.getErrorBody(body);
		if (Object.keys(errors).length) {
			throw new BadRequestException({
				statusCode: 400,
				error: 'Bad Request',
				message: errors,
			});
		}
		const user = this.userService.new({
			...body,
			hashPassword: UserService.passwordToHash(body.password),
		});
		try {
			await user.update();
		} catch (err) {
			this.loggerService.error(err, 'RegistrationController');
			throw new ConflictException('Username or Email already in Use');
		}
		try {
			const token = await this.tokenService.new('validEmail', user);
			await this.emailService.sendWelcomeMail(user, token);
		} catch (err) {
			this.loggerService.error(err, 'RegistrationController');
			/* istanbul ignore next */
			throw new InternalServerErrorException();
		}
		return { message: successMessage };
	}
}

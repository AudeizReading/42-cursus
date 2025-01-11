import {
	Body,
	Get,
	GoneException,
	InternalServerErrorException,
	Param,
	Post,
	HttpCode,
	BadRequestException,
	Logger,
} from '@nestjs/common';
import { TokenService } from '$token/token.service';
import { AuthService } from '$auth/auth.service';
import { EmailService } from './email.service';
import { UserService } from '$user/user.service';
import { IJWT } from '$auth/auth.interface';
import { Api } from './email.decorator';
import { IrecoveryBody, IrecoveryReturn } from './email.interface';
import { UseGuards } from '$security/security.decorator';
import { Controller } from '$app/app.decorator';

@Controller('email')
export class EmailController {
	constructor(
		private readonly tokenService: TokenService,
		private readonly authService: AuthService,
		private readonly emailService: EmailService,
		private readonly userService: UserService,
		private readonly loggerService: Logger,
	) {}

	@Api('validate')
	@UseGuards('notAuth')
	@Get('validate/:token')
	async validate(@Param('token') tokenInUrl: string): Promise<IJWT> {
		let token: TokenService;
		try {
			token = await this.tokenService.getByToken(tokenInUrl);
		} catch (e) {
			this.loggerService.error(e, 'EmailController');
			throw new BadRequestException('This token is invalid');
		}
		try {
			const user = await token.getUser();
			if (
				!token.isExpired() &&
				token.isReason('validEmail') &&
				!user.isValidateEmail()
			) {
				token.setExpired(true);
				user.setValidateEmail(true);
				token.update();
				user.update();
				return await this.authService.getJwt(user);
			}
		} catch (e) {
			this.loggerService.error(e, 'EmailController');
			/* istanbul ignore next */
			throw new InternalServerErrorException();
		}
		throw new GoneException('This token is expired');
	}

	@Api('recoveryPassword')
	@UseGuards('notAuth')
	@HttpCode(200)
	@Post('send/recovery')
	async recoveryPassword(
		@Body() body: IrecoveryBody,
	): Promise<IrecoveryReturn> {
		let user: UserService;
		try {
			user = await this.userService.getByEmail(body.email);
		} catch (error) {
			this.loggerService.error(error, 'EmailController');
			throw new BadRequestException('No user found with this email');
		}
		const token = await this.tokenService.new('recoveryPassword', user);
		await this.emailService.sendRecoveryPasswordMail(user, token);
		return {
			message: 'A link to change your password has been sent to you',
		};
	}
}

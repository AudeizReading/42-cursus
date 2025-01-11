import { BadRequestException, Body, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IJWT, ILogin } from './auth.interface';
import { Api } from './auth.decorator';
import { UseGuards } from '$security/security.decorator';
import { Controller } from '$app/app.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Api('signIn')
	@UseGuards('notAuth')
	@HttpCode(200)
	@Post('login')
	async signIn(@Body() body: ILogin): Promise<IJWT> {
		if (
			body == undefined ||
			body.username == undefined ||
			body.password == undefined
		) {
			throw new BadRequestException('Username or password is not define');
		}
		return await this.authService.signIn(body.username, body.password);
	}
}

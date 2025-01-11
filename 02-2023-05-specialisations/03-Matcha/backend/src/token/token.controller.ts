import { BadRequestException, Get, Param } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenExpired } from './token.schema';
import { Controller } from '$app/app.decorator';
import { UseGuards } from '$app/security/security.decorator';
import { Api } from './token.decorator';

@Controller('token')
export class TokenController {
	constructor(private readonly tokenService: TokenService) {}

	@Api('getTokenExpired')
	@UseGuards('notAuth')
	@Get(':token')
	async getTokenExpired(
		@Param('token') tokenInUrl: string,
	): Promise<TokenExpired> {
		try {
			const token = await this.tokenService.getByToken(tokenInUrl);
			return {
				expired: token.isExpired(),
			};
		} catch {
			throw new BadRequestException('Token not found');
		}
	}
}

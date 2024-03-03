import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Param,
	Body,
	BadRequestException,
	Req,
	HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';
import { InviteService } from './invite.service';

export class GameSettingsInterface {
	pointsToWin: number;
	ballSpeed: number;
	pointsGap: number;
	racketSize: number;
}

export class InviteDTO {
	fromID: number;
	toID: number;
	settings: GameSettingsInterface;
}

@Controller('invite')
export class InviteController
{
	constructor(
		private inviteService: InviteService,
	) {}

	@Post('send')
	@UseGuards(JwtAuthGuard)
	async send(@Req() req, @Body() invite: InviteDTO)
	{
		if (invite.toID === req.user.id) {
			console.log("Cannot invite self");
			throw new BadRequestException("Cannot invite self");
		}
		return this.inviteService.sendInvite(invite);
	}

	@Post(['delete', 'refuse'])
	@UseGuards(JwtAuthGuard)
	async delete(@Body() invite: InviteDTO)
	{
		console.log("Deleting invite");
		try {
			return this.inviteService.deleteInvite(invite);
		}
		catch (err) {
			throw new BadRequestException();
		}
	}

	@Post('accept')
	@UseGuards(JwtAuthGuard)
	async accept(@Body() invite: InviteDTO)
	{
		console.log("Accepting invite");
		return this.inviteService.acceptInvite(invite);
	}
}

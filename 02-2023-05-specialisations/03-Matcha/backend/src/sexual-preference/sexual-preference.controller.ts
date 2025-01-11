import { Controller } from '$app/app.decorator';
import { UseGuards } from '$security/security.decorator';
import { Get, Request } from '@nestjs/common';
import { SexualPreferenceService } from './sexual-preference.service';
import { OkResponsGetPreferences } from './sexual-preference.schema';
import { Api } from './sexual-preference.decorator';
import { IUserLogin } from '$app/user/user.interface';

@Controller('sexual-preference')
export class SexualPreferenceController {
	constructor(
		private readonly sexualPreferenceService: SexualPreferenceService,
	) {}

	@Api('getPreferences')
	@Get()
	@UseGuards('auth')
	async getPreferences(
		@Request() req: IUserLogin,
	): Promise<OkResponsGetPreferences> {
		return {
			preference: await this.sexualPreferenceService.getPreferences(
				req.user,
			),
		};
	}
}

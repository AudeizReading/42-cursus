import { Controller } from '$app/app.decorator';
import { Get } from '@nestjs/common';
import { UseGuards } from '$security/security.decorator';
import { GenderService } from './gender.service';
import { Api } from './gender.decorator';
import { OkResponseGetGenders } from './gender.schema';

@Controller('gender')
export class GenderController {
	constructor(private readonly genderService: GenderService) {}

	@Api('getGenders')
	@Get()
	@UseGuards('notAuth')
	getGenders(): OkResponseGetGenders {
		return {
			genders: this.genderService.getGenderType(),
		};
	}
}

import { ApiProperty } from '@nestjs/swagger';
import { Gender } from './gender.interface';

export class OkResponseGetGenders {
	@ApiProperty()
	genders: Gender[];
}

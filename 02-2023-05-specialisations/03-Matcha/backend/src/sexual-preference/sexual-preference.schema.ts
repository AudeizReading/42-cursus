import { ApiProperty } from '@nestjs/swagger';
import { Preference } from './sexual-preference.interface';

export class OkResponsGetPreferences {
	@ApiProperty()
	preference: Preference[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IchangePasswordByTokenBody, LocationType } from './user.interface';
import { IJWT } from '$auth/auth.interface';
import { Gender } from '$app/gender/gender.interface';
import { Preference } from '$app/sexual-preference/sexual-preference.interface';

export class ChangePasswordByTokenBody implements IchangePasswordByTokenBody {
	@ApiProperty()
	token: string;
	@ApiProperty()
	newPassword: string;
}

export class OkResponseChangePasswordByToken implements IJWT {
	@ApiProperty()
	access_token: string;
}

export class SetDescriptionBody {
	@ApiProperty()
	description: string;
}

export class SetGenderBody {
	@ApiProperty()
	gender: Gender;
}

export class SetSexualPreferenceBody {
	@ApiProperty()
	sexualPreference: Preference;
}

export class SetLocationType {
	@ApiProperty()
	locationType: LocationType;
}

export class SetBirthday {
	@ApiProperty()
	birthday: number;
}

export class GetUserViewQuery {
	@ApiProperty({
		required: false,
		description: 'Limit per result (default 5)',
	})
	limit?: number = 5;
	@ApiProperty({
		required: false,
		description: 'Page number (default 0)',
	})
	page?: number = 0;
}

export class GetUserLikeQuery extends GetUserViewQuery {}

export class BooleanStatusResponse {
	@ApiProperty()
	status: boolean;
}

export class StatsResponse {
	@ApiProperty()
	likeMe: number;
	@ApiProperty()
	like: number;
	@ApiProperty()
	viewMe: number;
	@ApiProperty()
	view: number;
	@ApiProperty()
	matches: number;
	@ApiProperty()
	blocked: number;
}

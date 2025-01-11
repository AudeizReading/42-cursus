import { ApiProperty } from '@nestjs/swagger';
import { IUser, Locations, LocationType } from '$user/user.interface';
import { TagType } from '$app/tag/tag.schema';
import { OkResponseGetFileInfo } from '$app/file/file.schema';
import { Gender } from '$app/gender/gender.interface';
import { Preference } from '$app/sexual-preference/sexual-preference.interface';
import { Oauth } from '$app/auth/oauth/db/db.schema';

export class OkResponseMe implements IUser {
	@ApiProperty()
	id: number;
	@ApiProperty()
	email: string;
	@ApiProperty()
	username: string;
	@ApiProperty()
	firstName: string;
	@ApiProperty()
	lastName: string;
	@ApiProperty()
	locationType: LocationType;
	@ApiProperty({ required: false })
	birthday?: Date;
	@ApiProperty()
	validateEmail: boolean;
	@ApiProperty({ required: false })
	description?: string;
	@ApiProperty({ required: false })
	gender?: Gender;
	@ApiProperty({ required: false })
	sexualPreference?: Preference;
	@ApiProperty({ required: false, type: [TagType] })
	tags?: TagType[];
	@ApiProperty({ required: false, type: [OkResponseGetFileInfo] })
	pictures?: OkResponseGetFileInfo[];
	@ApiProperty({ required: false, type: OkResponseGetFileInfo })
	defaultPicture?: OkResponseGetFileInfo;
	@ApiProperty({ required: false })
	locations?: Locations;
	@ApiProperty()
	fameRating: number;
	@ApiProperty()
	status: string;
	@ApiProperty({ required: false })
	reported?: number;
	@ApiProperty({ required: false, type: [Oauth] })
	oauth?: Oauth[];
}

export class ProfileIsCompletteResponse {
	@ApiProperty()
	defaultPicture: boolean;
	@ApiProperty()
	description: boolean;
	@ApiProperty()
	gender: boolean;
	@ApiProperty()
	sexualPreference: boolean;
	@ApiProperty()
	tags: boolean;
	@ApiProperty()
	birthday: boolean;
}

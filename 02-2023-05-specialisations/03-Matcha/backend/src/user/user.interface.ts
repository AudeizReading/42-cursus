import { Gender } from '$app/gender/gender.interface';
import { Preference } from '$app/sexual-preference/sexual-preference.interface';
import { IFile } from '$file/file.interface';
import { ITag } from '$tag/tag.interface';
import { ApiProperty } from '@nestjs/swagger';
import { UserService } from './user.service';
import { OkResponseGetFileInfo } from '$app/file/file.schema';
import { TagType } from '$app/tag/tag.schema';
import { Location } from '$location/location.schema';
import { Oauth } from '$app/auth/oauth/db/db.schema';

export type LocationType = 'IP' | 'NAVIGATOR' | 'FAKE';

interface IDefaultUser<D> {
	id: number;
	username: string;
	firstName: string;
	lastName: string;
	locationType: LocationType;
	birthday?: D;
	status: string;
	fameRating: number;
}

interface IUserType<T, D> extends IDefaultUser<D> {
	email: string;
	validateEmail: T;
}

interface IUserExtend {
	tags?: ITag[];
	pictures?: IFile[];
	defaultPicture?: IFile;
	description?: string;
	gender?: Gender;
	sexualPreference?: Preference;
	locations?: {
		ip?: Location;
		fake?: Location;
		navigator?: Location;
	};
	fameRating?: number;
	reported?: number;
	oauth?: Oauth[];
	iReportThisProfile?: boolean;
}

export type IUser = IUserType<boolean, Date> & IUserExtend;

export interface IDatabaseUser extends IUserType<number, number> {
	hashPassword: string;
}

export interface IchangePasswordByTokenBody {
	token: string;
	newPassword: string;
}

export interface InewUser {
	id?: number;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	hashPassword: string;
}

export interface IUserLogin {
	user: UserService;
}

export class UserUpdateDTO {
	@ApiProperty({ required: false })
	email?: string;
	@ApiProperty({ required: false })
	username?: string;
	@ApiProperty({ required: false })
	firstname?: string;
	@ApiProperty({ required: false })
	lastname?: string;
	@ApiProperty({ required: false })
	password?: string;
	@ApiProperty({ required: false })
	description?: string;
	@ApiProperty({ required: false })
	gender?: Gender;
	@ApiProperty({ required: false })
	sexualPreference?: Preference;
	@ApiProperty({ required: false })
	locationType?: LocationType;
	@ApiProperty({ required: false })
	birthday?: number;
}

export class Locations {
	@ApiProperty({ required: false, type: Location })
	ip?: Location;
	@ApiProperty({ required: false, type: Location })
	fake?: Location;
	@ApiProperty({ required: false, type: Location })
	navigator?: Location;
}

export class UserPublic implements IDefaultUser<Date>, IUserExtend {
	@ApiProperty()
	id: number;
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
	@ApiProperty({ required: false, type: [TagType] })
	tags?: ITag[];
	@ApiProperty({ required: false, type: [OkResponseGetFileInfo] })
	pictures?: IFile[];
	@ApiProperty({ required: false, type: OkResponseGetFileInfo })
	defaultPicture?: IFile;
	@ApiProperty({ required: false })
	description?: string;
	@ApiProperty({ required: false })
	gender?: Gender;
	@ApiProperty({ required: false })
	sexualPreference?: Preference;
	@ApiProperty({ required: false, type: Locations })
	locations?: Locations;
	@ApiProperty()
	fameRating: number;
	@ApiProperty()
	status: string;
	@ApiProperty({ required: false })
	reported?: number;
	@ApiProperty({ required: false })
	iReportThisProfile?: boolean;
}

export class UserPublicView {
	@ApiProperty()
	user: UserPublic;
	@ApiProperty()
	count: number;
}

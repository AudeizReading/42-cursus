import {
	IFacebookCursors,
	IFacebookPhoto,
	IFacebookPhotoId,
} from '$app/auth/oauth/oauth.interface';
import { ApiProperty } from '@nestjs/swagger';

export class PictureFacebook implements IFacebookPhoto {
	@ApiProperty()
	height: number;
	@ApiProperty()
	source: string;
	@ApiProperty()
	width: number;
}

export class PictureFacebookId implements IFacebookPhotoId {
	@ApiProperty()
	id: string;
	@ApiProperty({ type: [PictureFacebook] })
	images: PictureFacebook[];
}

export class CursorFacebook implements IFacebookCursors {
	@ApiProperty({ required: false })
	before?: string;
	@ApiProperty({ required: false })
	after?: string;
}

export class DataPictureFacebook {
	@ApiProperty({ type: [PictureFacebookId] })
	data: PictureFacebookId[];
	@ApiProperty({ type: CursorFacebook })
	cursors: CursorFacebook;
}

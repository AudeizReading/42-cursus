import { OkResponseGetFileInfo } from '$app/file/file.schema';
import { UserPublic } from '$app/user/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class Message {
	@ApiProperty()
	id: number;
	@ApiProperty({ type: UserPublic })
	sender: UserPublic;
	@ApiProperty({ type: UserPublic })
	receiver: UserPublic;
	@ApiProperty({ required: false })
	message?: string;
	@ApiProperty({ required: false, type: OkResponseGetFileInfo })
	file?: OkResponseGetFileInfo;
	@ApiProperty()
	read: boolean;
}

export class GetMessageQuery {
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

export class GetMessageQuery2 {
	@ApiProperty({
		required: false,
		description: 'Limit per result (default 5)',
	})
	limit?: number = 5;
	@ApiProperty({
		required: false,
		description: 'Return the messages up to this ID, without including it',
	})
	maxId?: number = undefined;
}

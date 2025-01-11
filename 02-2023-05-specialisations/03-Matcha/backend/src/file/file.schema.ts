import { ApiProperty } from '@nestjs/swagger';
import { Context, IFile, Type } from './file.interface';

export class OkResponseGetFileInfo implements IFile {
	@ApiProperty()
	id: number;

	@ApiProperty()
	url: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	originalName: string;

	@ApiProperty()
	context: Context;

	@ApiProperty()
	type: Type;

	@ApiProperty({
		required: false,
	})
	duration?: number;

	@ApiProperty({
		required: false,
	})
	width?: number;

	@ApiProperty({
		required: false,
	})
	height?: number;

	@ApiProperty()
	size: number;
}

export class SendFileChatDto {
	@ApiProperty()
	userId: number;
}

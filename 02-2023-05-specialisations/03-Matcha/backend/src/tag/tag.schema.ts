import { ApiProperty } from '@nestjs/swagger';
import { ITag } from './tag.interface';

export class GetTagQuery {
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
	@ApiProperty({
		required: false,
		description: 'Tag content',
	})
	search?: string = '';
}

export class TagType implements ITag {
	@ApiProperty()
	id: number;
	@ApiProperty()
	name: string;
}

export class GetTagReturn {
	@ApiProperty({ type: [TagType] })
	results: TagType[];
	@ApiProperty()
	limit: number;
	@ApiProperty()
	currentPage: number;
	@ApiProperty()
	totalPage: number;
}

export class PostTag {
	@ApiProperty()
	tag: string;
}

export class DeleteTag extends PostTag {}

export class TagOkReturn {
	@ApiProperty()
	message: string;
	@ApiProperty()
	tag: TagType;
}

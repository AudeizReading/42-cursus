import { UserPublic } from '$app/user/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class QueryBlock {
	@ApiProperty({ required: false, default: 0 })
	page?: number = 0;
	@ApiProperty({ required: false, default: 5 })
	limit?: number = 5;
}

export class OkResponseGetBlock {
	@ApiProperty({ type: [UserPublic] })
	results: UserPublic[];
	@ApiProperty()
	limit: number;
	@ApiProperty()
	currentPage: number;
}

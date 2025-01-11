import { Controller } from '$app/app.decorator';
import { Get, Query, Request } from '@nestjs/common';
import { Api } from './block.decorator';
import { UseGuards } from '$app/security/security.decorator';
import { IUserLogin } from '$app/user/user.interface';
import { BlockService } from './block.service';
import { OkResponseGetBlock, QueryBlock } from './block.scheme';

@Controller('block')
export class BlockController {
	constructor(private readonly blockService: BlockService) {}

	@Api('getBlockedUser')
	@UseGuards('profilCompleted')
	@Get()
	async getBlockedUser(
		@Request() req: IUserLogin,
		@Query() params: QueryBlock,
	): Promise<OkResponseGetBlock> {
		const user = req.user;
		const search = new QueryBlock();
		if (params?.limit) search.limit = params.limit;
		if (params?.page) search.page = params.page;
		return await this.blockService.getBlockedUserSearch(user, search);
	}
}

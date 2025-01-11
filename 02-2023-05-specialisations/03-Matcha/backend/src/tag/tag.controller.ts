import {
	Delete,
	Get,
	Post,
	Query,
	Request,
	Body,
	BadRequestException,
	HttpCode,
} from '@nestjs/common';
import { Controller } from '$app/app.decorator';
import { UseGuards } from '$security/security.decorator';
import { Api } from './tag.decorator';
import {
	DeleteTag,
	GetTagQuery,
	GetTagReturn,
	PostTag,
	TagOkReturn,
} from './tag.schema';
import { TagService } from './tag.service';
import { ITag, ITagRequest } from './tag.interface';

@Controller('tag')
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@Api('getTag')
	@Get()
	@UseGuards('notAuth')
	async getTags(@Query() params: GetTagQuery): Promise<GetTagReturn> {
		if (params == undefined) params = new GetTagQuery();
		if (!params?.limit) params.limit = 5;
		else params.limit = Number(params.limit);
		if (!params?.page) params.page = 0;
		else params.page = Number(params.page);
		if (!params?.search) params.search = '';
		return await this.tagService.search(params);
	}

	@Api('postTag')
	@Post()
	@UseGuards('auth')
	@HttpCode(200)
	async addTag(
		@Request() req: ITagRequest,
		@Body() body: PostTag,
	): Promise<TagOkReturn> {
		let tag: ITag = undefined;
		try {
			tag = await req.user.setTag(body.tag);
		} catch {
			throw new BadRequestException({
				error: 'BadRequest',
				statusCode: 400,
				message: 'Tag Name is not Good',
			});
		}
		return { message: 'Tag add success', tag };
	}

	@Api('deleteTag')
	@Delete()
	@UseGuards('auth')
	async removeTag(
		@Request() req: ITagRequest,
		@Body() body: DeleteTag,
	): Promise<TagOkReturn> {
		let tag: ITag = undefined;
		try {
			tag = await req.user.deleteTag(body.tag);
		} catch {
			throw new BadRequestException({
				error: 'BadRequest',
				statusCode: 400,
				message: 'Tag Name is not Good',
			});
		}
		return { message: 'Tag delete with success', tag };
	}
}

import { Get, Request, Query, Body, Post, HttpCode } from '@nestjs/common';
import { BrowsingService } from './browsing.service';
import { UseGuards } from '$app/security/security.decorator';
import { Controller } from '$app/app.decorator';
import { IUserLogin } from '$app/user/user.interface';
import {
	BrowsingQuery,
	OkResponseBrowsing,
	SearchBrowsingDto,
	SearchGapQuery,
} from './browsing.schema';
import { Api } from './browsing.decorator';

@Controller('browsing')
export class BrowsingController {
	constructor(private readonly browsingService: BrowsingService) {}

	@Api('browsing')
	@UseGuards('profilCompleted')
	@Get()
	async browsing(
		@Request() req: IUserLogin,
		@Query() params: SearchGapQuery,
	): Promise<OkResponseBrowsing> {
		if (params == undefined) params = new BrowsingQuery();
		if (!params?.currentUser) params.currentUser = 0;
		else params.currentUser = Number(params.currentUser);
		if (!params?.howManyUser) params.howManyUser = 5;
		else params.howManyUser = Number(params.howManyUser);
		if (!params?.orderBy) params.orderBy = 'location';
		if (!params?.sortBy) params.sortBy = 'ASC';
		const user = req.user;
		const results = await this.browsingService.getUsers(
			user,
			params.currentUser,
			params.howManyUser,
			params.orderBy,
			params.sortBy,
			params.ageMin,
			params.ageMax,
			params.commonTagMin,
			params.commonTagMax,
			params.fameRatingMin,
			params.fameRatingMax,
			params.locationMin,
			params.locationMax,
		);
		return {
			results,
		};
	}

	@Api('search')
	@UseGuards('profilCompleted')
	@Post('search')
	@HttpCode(200)
	async search(
		@Request() req: IUserLogin,
		@Query() params: BrowsingQuery,
		@Body() searchBrowsingDto: SearchBrowsingDto,
	): Promise<OkResponseBrowsing> {
		if (params == undefined) params = new BrowsingQuery();
		if (!params?.currentUser) params.currentUser = 5;
		else params.currentUser = Number(params.currentUser);
		if (!params?.howManyUser) params.howManyUser = 5;
		else params.howManyUser = Number(params.howManyUser);
		if (!params?.orderBy) params.orderBy = 'location';
		if (!params?.sortBy) params.sortBy = 'ASC';
		const user = req.user;
		const results = await this.browsingService.search(
			user,
			params.currentUser,
			params.howManyUser,
			params.orderBy,
			params.sortBy,
			searchBrowsingDto,
		);
		return {
			results,
		};
	}
}

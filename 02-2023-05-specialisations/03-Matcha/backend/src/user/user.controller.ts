import {
	BadRequestException,
	Body,
	Request,
	GoneException,
	HttpCode,
	Put,
	Param,
	Get,
	Query,
	Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegistrationService } from '$registration/registration.service';
import { TokenService } from '$token/token.service';
import { AuthService } from '$auth/auth.service';
import { IJWT } from '$auth/auth.interface';
import {
	IUser,
	IUserLogin,
	IchangePasswordByTokenBody,
	UserPublic,
	UserUpdateDTO,
} from './user.interface';
import { Api } from './user.decorator';
import { UseGuards } from '$security/security.decorator';
import { Controller } from '$app/app.decorator';
import {
	BooleanStatusResponse,
	GetUserLikeQuery,
	GetUserViewQuery,
	SetBirthday,
	SetDescriptionBody,
	SetGenderBody,
	SetLocationType,
	SetSexualPreferenceBody,
	StatsResponse,
} from './user.schema';

@Controller('user')
export class UserController {
	constructor(
		private readonly tokenService: TokenService,
		private readonly authService: AuthService,
		private readonly loggerService: Logger,
	) {}

	@Api('changePasswordByToken')
	@UseGuards('notAuth')
	@Put('changePasswordBytoken')
	async changePasswordByToken(
		@Body() body: IchangePasswordByTokenBody,
	): Promise<IJWT> {
		if (
			body == undefined ||
			body.newPassword == undefined ||
			body.token == undefined
		)
			throw new BadRequestException('Body is invalid');
		if (!RegistrationService.passwordIsValid(body.newPassword)) {
			throw new BadRequestException('This password is not secure');
		}
		let token: TokenService;
		try {
			token = await this.tokenService.getByToken(body.token);
		} catch (e) {
			this.loggerService.error(e, 'UserController');
			throw new BadRequestException('This token is invalid');
		}
		if (token.isExpired()) {
			throw new GoneException('This token is expired');
		}
		const user = await token.getUser();
		user.setHashPassword(UserService.passwordToHash(body.newPassword));
		token.setExpired(true);
		await token.update();
		await user.update();
		return await this.authService.getJwt(user);
	}

	@Api('setDefaultPicture')
	@UseGuards('auth')
	@Put('defaultPicture/:id')
	@HttpCode(200)
	async setDefaultPicture(
		@Request() req: IUserLogin,
		@Param('id') id: number,
	): Promise<void> {
		await req.user.setDefaultPicture(id);
	}

	@Api('setDescription')
	@UseGuards('auth')
	@Put('description')
	@HttpCode(200)
	async setDescription(
		@Request() req: IUserLogin,
		@Body() body: SetDescriptionBody,
	): Promise<void> {
		await req.user.setDescription(body.description);
	}

	@Api('setGender')
	@UseGuards('auth')
	@Put('gender')
	@HttpCode(200)
	async setGender(
		@Request() req: IUserLogin,
		@Body() body: SetGenderBody,
	): Promise<void> {
		await req.user.setGender(body.gender);
		const sexualPreference = await req.user.getSexualPreference();
		if (sexualPreference === undefined) return;
		switch (body.gender) {
			case 'Man':
				if (sexualPreference.preference == 'Lesbian') {
					await req.user.setSexualPreference('Gay');
				}
				return;
			case 'Woman':
				if (sexualPreference.preference == 'Gay') {
					await req.user.setSexualPreference('Lesbian');
				}
				return;
		}
	}

	@Api('setSexualPreference')
	@UseGuards('auth')
	@Put('sexualPreference')
	@HttpCode(200)
	async setSexualPreference(
		@Request() req: IUserLogin,
		@Body() body: SetSexualPreferenceBody,
	): Promise<void> {
		await req.user.setSexualPreference(body.sexualPreference);
	}

	@Api('setLocationType')
	@UseGuards('auth')
	@Put('locationType')
	@HttpCode(200)
	async setLocationType(
		@Request() req: IUserLogin,
		@Body() body: SetLocationType,
	): Promise<void> {
		try {
			req.user.setLocationType(body.locationType);
			await req.user.update();
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	@Api('setBirthday')
	@UseGuards('auth')
	@Put('birthday')
	@HttpCode(200)
	async setBirthday(
		@Request() req: IUserLogin,
		@Body() body: SetBirthday,
	): Promise<void> {
		try {
			req.user.setBirthday(body.birthday);
			await req.user.update();
		} catch (err) {
			throw new BadRequestException(err.message);
		}
	}

	@Api('update')
	@UseGuards('profilCompleted')
	@Put()
	@HttpCode(200)
	async update(
		@Request() req: IUserLogin,
		@Body() userUpdateDto: UserUpdateDTO,
	): Promise<IUser> {
		let update = 0;
		let total = 0;
		const errors: string[] = [];
		if (userUpdateDto?.description) {
			total++;
			try {
				req.user.setDescription(userUpdateDto.description);
				update++;
			} catch (err) {
				errors.push(err);
			}
		}
		if (userUpdateDto?.email) {
			total++;
			try {
				req.user.setEmail(userUpdateDto.email);
				update++;
			} catch (err) {
				errors.push(err);
			}
		}
		if (userUpdateDto?.firstname) {
			total++;
			try {
				req.user.setFirstName(userUpdateDto.firstname);
				update++;
			} catch (err) {
				errors.push(err);
			}
		}
		if (userUpdateDto?.lastname) {
			total++;
			try {
				req.user.setLastName(userUpdateDto.lastname);
				update++;
			} catch (err) {
				errors.push(err);
			}
		}
		if (userUpdateDto?.birthday) {
			total++;
			try {
				req.user.setBirthday(userUpdateDto.birthday);
				update++;
			} catch (err) {
				errors.push(err);
			}
		}
		if (userUpdateDto?.username) {
			total++;
			try {
				req.user.setUsername(userUpdateDto.username);
				update++;
			} catch (err) {
				errors.push(err);
			}
		}
		if (userUpdateDto?.password) {
			total++;
			try {
				req.user.setHashPassword(
					UserService.passwordToHash(userUpdateDto.password),
				);
				update++;
			} catch (err) {
				errors.push(err);
			}
		}
		if (userUpdateDto?.locationType) {
			total++;
			try {
				req.user.setLocationType(userUpdateDto?.locationType);
				update++;
			} catch (err) {
				errors.push(err);
			}
		}
		if (update) await req.user.update();
		if (userUpdateDto?.gender) {
			total++;
			try {
				await req.user.setGender(userUpdateDto.gender);
				update++;
			} catch (err) {
				errors.push(err);
			}
		}
		if (userUpdateDto?.sexualPreference) {
			total++;
			try {
				await req.user.setSexualPreference(
					userUpdateDto.sexualPreference,
				);
				update++;
			} catch (err) {
				errors.push(err);
			}
		}
		if (errors.length) {
			throw new BadRequestException([
				`Update ${update} of ${total}`,
				...errors,
			]);
		}
		return await req.user.getMe();
	}

	@Api('getView')
	@UseGuards('profilCompleted')
	@Get('view')
	async getView(
		@Request() req: IUserLogin,
		@Query() params: GetUserViewQuery,
	): Promise<{ user: UserPublic; count: number }[]> {
		if (params == undefined) params = new GetUserViewQuery();
		if (!params?.limit) params.limit = 5;
		else params.limit = Number(params.limit);
		if (!params?.page) params.page = 0;
		else params.page = Number(params.page);
		return await req.user.getProfilesThatVisitedMe(
			params.limit,
			params.page,
		);
	}

	@Api('getVisitedView')
	@UseGuards('profilCompleted')
	@Get('visited')
	async getVisitedView(
		@Request() req: IUserLogin,
		@Query() params: GetUserViewQuery,
	): Promise<{ user: UserPublic; count: number }[]> {
		if (params == undefined) params = new GetUserViewQuery();
		if (!params?.limit) params.limit = 5;
		else params.limit = Number(params.limit);
		if (!params?.page) params.page = 0;
		else params.page = Number(params.page);
		return await req.user.getProfilesIVisited(params.limit, params.page);
	}

	@Api('getLike')
	@UseGuards('profilCompleted')
	@Get('like')
	async getLike(
		@Request() req: IUserLogin,
		@Query() params: GetUserLikeQuery,
	): Promise<UserPublic[]> {
		if (params == undefined) params = new GetUserLikeQuery();
		if (!params?.limit) params.limit = 5;
		else params.limit = Number(params.limit);
		if (!params?.page) params.page = 0;
		else params.page = Number(params.page);
		return await req.user.getLike(params.limit, params.page);
	}

	@Api('getLiked')
	@UseGuards('profilCompleted')
	@Get('liked')
	async getLiked(
		@Request() req: IUserLogin,
		@Query() params: GetUserLikeQuery,
	): Promise<UserPublic[]> {
		if (params == undefined) params = new GetUserLikeQuery();
		if (!params?.limit) params.limit = 5;
		else params.limit = Number(params.limit);
		if (!params?.page) params.page = 0;
		else params.page = Number(params.page);
		return await req.user.getLiked(params.limit, params.page);
	}

	@Api('getMatch')
	@UseGuards('profilCompleted')
	@Get('match')
	async getMatch(
		@Request() req: IUserLogin,
		@Query() params: GetUserLikeQuery,
	): Promise<UserPublic[]> {
		if (params == undefined) params = new GetUserLikeQuery();
		if (!params?.limit) params.limit = 5;
		else params.limit = Number(params.limit);
		if (!params?.page) params.page = 0;
		else params.page = Number(params.page);
		return await req.user.getMatch(params.limit, params.page);
	}

	@Api('likeId')
	@UseGuards('profilCompleted')
	@Get('like/:id')
	async likeId(
		@Request() req: IUserLogin,
		@Param('id') id: number,
	): Promise<BooleanStatusResponse> {
		const userService = new UserService();
		const user = await userService.getByPK(id);
		return { status: await user.isLike(req.user.getId()) };
	}

	@Api('likedId')
	@UseGuards('profilCompleted')
	@Get('liked/:id')
	async likedId(
		@Request() req: IUserLogin,
		@Param('id') id: number,
	): Promise<BooleanStatusResponse> {
		return { status: await req.user.isLike(id) };
	}

	@Api('visitedId')
	@UseGuards('profilCompleted')
	@Get('visited/:id')
	async visitedId(
		@Request() req: IUserLogin,
		@Param('id') id: number,
	): Promise<BooleanStatusResponse> {
		return { status: await req.user.isView(id) };
	}

	@Api('viewId')
	@UseGuards('profilCompleted')
	@Get('view/:id')
	async viewId(
		@Request() req: IUserLogin,
		@Param('id') id: number,
	): Promise<BooleanStatusResponse> {
		const userService = new UserService();
		const user = await userService.getByPK(id);
		return { status: await user.isView(req.user.getId()) };
	}

	@Api('matchId')
	@UseGuards('profilCompleted')
	@Get('matches/:id')
	async matchId(
		@Request() req: IUserLogin,
		@Param('id') id: number,
	): Promise<BooleanStatusResponse> {
		const userService = new UserService();
		const user = await userService.getByPK(id);
		return { status: await req.user.isMatch(user) };
	}

	@Api('stats')
	@UseGuards('profilCompleted')
	@Get('stats')
	async stats(@Request() req: IUserLogin): Promise<StatsResponse> {
		const user = req.user;
		return {
			likeMe: await user.getLikeMeCount(),
			like: await user.getLikedCount(),
			viewMe: await user.getViewMeCount(),
			view: await user.getViewedCount(),
			matches: await user.getMatchCount(),
			blocked: await user.getBlockedCount(),
		};
	}
}

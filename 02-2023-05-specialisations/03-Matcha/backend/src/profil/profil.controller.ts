import {
	ConflictException,
	ForbiddenException,
	Get,
	NotFoundException,
	Put,
	Request,
	Param,
	Logger,
} from '@nestjs/common';
import { IUser, UserPublic } from '$user/user.interface';
import { Api } from './profil.decorator';
import { UseGuards } from '$security/security.decorator';
import { Controller } from '$app/app.decorator';
import { ImeRequest } from './profil.interface';
import { UserService } from '$app/user/user.service';
import { ViewService } from '$app/view/view.service';
import { LikeService } from '$app/like/like.service';
import { ProfileIsCompletteResponse } from './profil.schema';
import { DislikeService } from '$app/like/dislike.service';
import { ApiTags } from '@nestjs/swagger';
import { IReport } from '$app/report/report.interface';

@Controller('profile')
export class ProfilController {
	constructor(
		private readonly userService: UserService,
		private readonly viewService: ViewService,
		private readonly likeService: LikeService,
		private readonly dislikeService: DislikeService,
		private readonly loggerService: Logger,
	) {}

	@Api('isComplette')
	@UseGuards('auth')
	@Get()
	async isComplette(
		@Request() req: ImeRequest,
	): Promise<ProfileIsCompletteResponse> {
		const user = await req.user.getMe();
		const values = new ProfileIsCompletteResponse();
		values.birthday = user.birthday !== undefined;
		values.defaultPicture = user.defaultPicture !== undefined;
		values.description = user.description !== undefined;
		values.gender = user.gender !== undefined;
		values.sexualPreference = user.sexualPreference !== undefined;
		values.tags = user.tags !== undefined && user.tags.length >= 1;
		return values;
	}

	@Api('me')
	@UseGuards('auth')
	@Get('me')
	async me(@Request() req: ImeRequest): Promise<IUser> {
		return await req.user.getMe();
	}

	@Api('publicUser')
	@UseGuards('profilCompleted')
	@Get(':id')
	async publicUser(
		@Request() req: ImeRequest,
		@Param('id') idUser: number,
	): Promise<UserPublic> {
		try {
			const user = await this.userService.getByPK(idUser);
			const me = req.user;
			if (!(await user.isComplete()) || (await me.isBlocked(user))) {
				throw new NotFoundException('Profile not found');
			}
			return {
				...(await user.getPublic()),
				iReportThisProfile:
					(await user.getReported<IReport[]>(true)).filter(
						(v) => v.userId == req.user.getId(),
					).length >= 1,
			};
		} catch {
			throw new NotFoundException('Profile not found');
		}
	}

	@Api('viewUser')
	@UseGuards('profilCompleted')
	@Put(':id/view')
	async viewUser(
		@Request() req: ImeRequest,
		@Param('id') idUser: number,
	): Promise<void> {
		try {
			const me = req.user;
			const viewUser = await this.userService.getByPK(idUser);
			if (
				!(await viewUser.isComplete()) ||
				(await me.isBlocked(viewUser))
			) {
				throw new NotFoundException('Profile not found');
			}
			const viewService = this.viewService.newInstance();
			viewService.setUser(me);
			await viewService.setView(viewUser);
			return await viewService.update();
		} catch (err) {
			if (err instanceof ConflictException) {
				throw err;
			}
			if (err instanceof ForbiddenException) {
				throw err;
			}
			throw new NotFoundException('Profile not found');
		}
	}

	@Api('likeUser')
	@UseGuards('profilCompleted')
	@Put(':id/like')
	async likeUser(
		@Request() req: ImeRequest,
		@Param('id') idUser: number,
	): Promise<void> {
		try {
			const me = req.user;
			const likeUser = await this.userService.getByPK(idUser);
			if (
				!(await likeUser.isComplete()) ||
				(await me.isBlocked(likeUser))
			) {
				throw new NotFoundException('Profile not found');
			}
			const likeService = this.likeService.newInstance();
			likeService.setUser(me);
			await likeService.setLike(likeUser);
			return await likeService.update();
		} catch (err) {
			if (err instanceof ConflictException) {
				throw err;
			}
			if (err instanceof ForbiddenException) {
				throw err;
			}
			throw new NotFoundException('Profile not found');
		}
	}

	@Api('dislikeUser')
	@UseGuards('profilCompleted')
	@Put(':id/dislike')
	async dislikeUser(
		@Request() req: ImeRequest,
		@Param('id') idUser: number,
	): Promise<void> {
		try {
			const me = req.user;
			const likeUser = await this.userService.getByPK(idUser);
			if (
				!(await likeUser.isComplete()) ||
				(await me.isBlocked(likeUser))
			) {
				throw new NotFoundException('Profile not found');
			}
			const dislikeService = this.dislikeService.newInstance();
			dislikeService.setUser(me);
			await dislikeService.setDislike(likeUser);
			return await dislikeService.update();
		} catch (err) {
			if (err instanceof ConflictException) {
				throw err;
			}
			if (err instanceof ForbiddenException) {
				throw err;
			}
			throw new NotFoundException('Profile not found');
		}
	}

	@Api('unlikeUser')
	@UseGuards('profilCompleted')
	@Put(':id/unlike')
	async unlikeUser(
		@Request() req: ImeRequest,
		@Param('id') idUser: number,
	): Promise<void> {
		const likeService = this.likeService.newInstance();
		const me = req.user;
		const unlikeUser = await this.userService.getByPK(idUser);
		if (await me.isBlocked(unlikeUser)) {
			throw new NotFoundException('Profile not found');
		}
		await likeService.unlike(req.user.getId(), idUser);
	}

	@Api('reportUser')
	@UseGuards('profilCompleted')
	@Put(':id/report')
	async reportUser(
		@Request() req: ImeRequest,
		@Param('id') idUser: number,
	): Promise<void> {
		try {
			const me = req.user;
			const reportUser = await this.userService.getByPK(idUser);
			if (await me.isBlocked(reportUser)) {
				throw new NotFoundException('Profile not found');
			}
			await me.reportUser(reportUser.getId());
		} catch (err) {
			if (err instanceof ConflictException) {
				throw err;
			}
			if (err instanceof ForbiddenException) {
				throw err;
			}
			throw new NotFoundException('Profile not found');
		}
	}

	@Api('blockUser')
	@ApiTags('Block')
	@UseGuards('profilCompleted')
	@Put(':id/block')
	async blockUser(
		@Request() req: ImeRequest,
		@Param('id') idUser: number,
	): Promise<void> {
		try {
			const me = req.user;
			const blockUser = await this.userService.getByPK(idUser);
			if (await me.isBlocked(blockUser)) {
				throw new NotFoundException('Profile not found');
			}
			await me.blockUser(blockUser.getId());
		} catch (err) {
			if (err instanceof ConflictException) {
				throw err;
			}
			if (err instanceof ForbiddenException) {
				throw err;
			}
			throw new NotFoundException('Profile not found');
		}
	}

	@Api('unblockUser')
	@ApiTags('Block')
	@UseGuards('profilCompleted')
	@Put(':id/unblock')
	async unblockUser(
		@Request() req: ImeRequest,
		@Param('id') idUser: number,
	): Promise<void> {
		await req.user.unblockUser(idUser);
	}
}

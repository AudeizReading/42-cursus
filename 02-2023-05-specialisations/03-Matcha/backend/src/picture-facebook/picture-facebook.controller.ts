import { Controller } from '$app/app.decorator';
import { OauthService } from '$app/auth/oauth/oauth.service';
import { UseGuards } from '$app/security/security.decorator';
import { IUserLogin } from '$app/user/user.interface';
import { BadRequestException, Get, Param, Put, Request } from '@nestjs/common';
import { Api } from './picture-facebook.decorator';
import { IFacebookOauth } from '$app/auth/oauth/oauth.interface';
import { DataPictureFacebook } from './picture-facebook.schema';
import { PictureFacebookService } from './picture-facebook.service';
import { OkResponseGetFileInfo } from '$app/file/file.schema';

@Controller('picture-facebook')
export class PictureFacebookController {
	constructor(
		private readonly pictureFacebookService: PictureFacebookService,
		private readonly oauthService: OauthService,
	) {}

	@Api('rightReadPictureFacebook')
	@UseGuards('auth')
	@Get('right')
	async rightReadPictureFacebook(
		@Request() req: IUserLogin,
	): Promise<void | IFacebookOauth> {
		return await this.pictureFacebookService.rightReadPictureFacebook(
			req.user,
		);
	}

	@Api('getPicture')
	@UseGuards('auth')
	@Get('picture')
	async getPicture(@Request() req: IUserLogin): Promise<DataPictureFacebook> {
		const token =
			(await this.pictureFacebookService.rightReadPictureFacebook(
				req.user,
				true,
			)) as IFacebookOauth;
		const userInformation = await this.oauthService.facebookGetMe(token);
		const dataPicture = await this.pictureFacebookService.facebookGetPhotos(
			token,
			userInformation,
		);
		return this.pictureFacebookService.normalizeValue(dataPicture);
	}

	@Api('getPicture')
	@UseGuards('auth')
	@Get('picture/before/:token')
	async getBefore(
		@Request() req: IUserLogin,
		@Param('token') tokenCursors: string,
	): Promise<DataPictureFacebook> {
		const token =
			(await this.pictureFacebookService.rightReadPictureFacebook(
				req.user,
				true,
			)) as IFacebookOauth;
		const userInformation = await this.oauthService.facebookGetMe(token);
		const dataPicture = await this.pictureFacebookService.getBeforeAfter(
			token,
			userInformation,
			tokenCursors,
			true,
		);
		return this.pictureFacebookService.normalizeValue(dataPicture);
	}

	@Api('getPicture')
	@UseGuards('auth')
	@Get('picture/after/:token')
	async getAfter(
		@Request() req: IUserLogin,
		@Param('token') tokenCursors: string,
	): Promise<DataPictureFacebook> {
		const token =
			(await this.pictureFacebookService.rightReadPictureFacebook(
				req.user,
				true,
			)) as IFacebookOauth;
		const userInformation = await this.oauthService.facebookGetMe(token);
		const dataPicture = await this.pictureFacebookService.getBeforeAfter(
			token,
			userInformation,
			tokenCursors,
			false,
		);
		return this.pictureFacebookService.normalizeValue(dataPicture);
	}

	@Api('addPictureInProfil')
	@UseGuards('auth')
	@Put(':idPictureFacebook')
	async addPictureInProfil(
		@Request() req: IUserLogin,
		@Param('idPictureFacebook') idPictureFacebook: string,
	): Promise<OkResponseGetFileInfo> {
		const token =
			(await this.pictureFacebookService.rightReadPictureFacebook(
				req.user,
				true,
			)) as IFacebookOauth;
		if ((await req.user.getPictureProfil()).length >= 5) {
			throw new BadRequestException(
				'You have already uploaded the maximum number of \
			allowed photos (5). No additional photos can be uploaded.',
			);
		}
		const picture = await this.pictureFacebookService.getPictureFacebook(
			token,
			idPictureFacebook,
		);
		const file = await fetch(picture.images[0].source).then(async (res) =>
			Buffer.from(await res.arrayBuffer()),
		);
		return await req.user.addPictureToProfil(file, picture.id);
	}
}

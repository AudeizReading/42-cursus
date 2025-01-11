import { Controller } from '$app/app.decorator';
import { Get, Put, Query, Res, Request, Body, Delete } from '@nestjs/common';
import {
	CodeDto,
	LinkOauthDto,
	OauthInformation,
	OauthInformationDto,
} from './oauth.schema';
import { OauthService } from './oauth.service';
import { UseGuards } from '$app/security/security.decorator';
import { Api } from './oauth.decorator';
import { Response } from 'express';
import { IUserLogin } from '$app/user/user.interface';
import { DbService } from './db/db.service';
import { UserService } from '$app/user/user.service';
import { AuthService } from '../auth.service';
import {
	IFacebookMe,
	IFacebookOauth,
	IGoogleMe,
	IGoogleOauth,
} from './oauth.interface';

@Controller('oauth')
export class OauthController {
	constructor(
		private readonly oauthService: OauthService,
		private readonly authService: AuthService,
	) {}

	@Api('getOauthInformations')
	@UseGuards('notAuth')
	@Get()
	getOauthInformations(
		@Query() createUser: OauthInformationDto,
	): OauthInformation[] {
		const user = createUser?.createUser !== 'false';
		return [
			this.oauthService.googleInformation(user),
			this.oauthService.facebookInformation(user),
		];
	}

	@Api('google')
	@UseGuards('notAuth')
	@Get('google')
	async google(@Query() code: CodeDto, @Res() res: Response): Promise<void> {
		let createUser = true;
		if (code?.state) {
			createUser = JSON.parse(code.state).createUser;
		}
		const oauthService = new DbService();
		const userService = new UserService();
		let token: IGoogleOauth;
		let userInformation: IGoogleMe;
		try {
			token = await this.oauthService.googleCodeToToken(code.code);
			userInformation = await this.oauthService.googleGetMe(token);
		} catch {
			res.send(
				this.oauthService.scriptValue({
					error: 'Invalid value for google',
				}),
			);
			return;
		}
		const oauth = await oauthService.newOauth(
			userInformation.id,
			token.access_token,
			'Google',
			new Date().getTime() + token.expires_in,
		);
		if (createUser == false) {
			if (oauth.getUserId() == undefined) {
				res.send(this.oauthService.scriptValue(userInformation));
			} else {
				res.send(
					this.oauthService.scriptValue({
						error: 'This account is already link in other account',
					}),
				);
			}
			return;
		}
		if (oauth.getUserId() == undefined) {
			try {
				await userService.getByEmail(userInformation.email);
				res.send(
					this.oauthService.scriptValue({
						error: 'Please link your account after connect existing account',
					}),
				);
				return;
			} catch {
				/* ignored */
			}
			const user = userService.new({
				email: userInformation.email,
				username:
					`${userInformation.given_name.slice(0, 1)}${userInformation.family_name}` +
					`_gl_${userInformation.id}`,
				firstName: userInformation.given_name,
				lastName: userInformation.family_name,
				hashPassword: 'OAUTH',
			});
			await user.update();
			user.setValidateEmail(true);
			await user.update();
			oauth.setUser(user);
			await oauth.update();
			const bufferImage = await fetch(userInformation.picture).then(
				async (res) => Buffer.from(await res.arrayBuffer()),
			);
			const file = await user.addPictureToProfil(
				bufferImage,
				'google_oauth',
			);
			await user.setDefaultPicture(file.id);
			const jwt = await this.authService.getJwt(user);
			res.send(this.oauthService.scriptValue(jwt));
			return;
		}
		const user = await oauth.getUser();
		const jwt = await this.authService.getJwt(user);
		res.send(this.oauthService.scriptValue(jwt));
	}

	@Api('facebook')
	@UseGuards('notAuth')
	@Get('facebook')
	async facebook(
		@Query() code: CodeDto,
		@Res() res: Response,
	): Promise<void> {
		let createUser = true;
		if (code?.state) {
			createUser = JSON.parse(code.state).createUser;
		}
		const oauthService = new DbService();
		const userService = new UserService();
		let token: IFacebookOauth;
		let userInformation: IFacebookMe;
		try {
			token = await this.oauthService.facebookCodeToToken(code.code);
			userInformation = await this.oauthService.facebookGetMe(token);
		} catch {
			res.send(
				this.oauthService.scriptValue({
					error: 'Invalid value for Facebook',
				}),
			);
			return;
		}
		const oauth = await oauthService.newOauth(
			userInformation.id,
			token.access_token,
			'Facebook',
			new Date().getTime() + token.expires_in,
		);
		if (userInformation?.email == undefined) {
			res.send(
				this.oauthService.scriptValue({
					error: 'Please authorize email in scope',
				}),
			);
			return;
		}
		if (createUser == false) {
			if (oauth.getUserId() == undefined) {
				res.send(this.oauthService.scriptValue(userInformation));
			} else {
				res.send(
					this.oauthService.scriptValue({
						error: 'This account is already link in other account',
					}),
				);
			}
			return;
		}
		if (oauth.getUserId() == undefined) {
			try {
				await userService.getByEmail(userInformation.email);
				res.send(
					this.oauthService.scriptValue({
						error: 'Please link your account after connect existing account',
					}),
				);
				return;
			} catch {
				/* ignored */
			}
			const user = userService.new({
				email: userInformation.email,
				username:
					`${userInformation.first_name.slice(0, 1)}${userInformation.last_name}` +
					`_fb_${userInformation.id}`,
				firstName: userInformation.first_name,
				lastName: userInformation.last_name,
				hashPassword: 'OAUTH',
			});
			await user.update();
			user.setValidateEmail(true);
			await user.update();
			oauth.setUser(user);
			await oauth.update();
			const bufferImage = await fetch(
				userInformation.picture.data.url,
			).then(async (res) => Buffer.from(await res.arrayBuffer()));
			const file = await user.addPictureToProfil(
				bufferImage,
				'facebook_oauth',
			);
			await user.setDefaultPicture(file.id);
			if (userInformation.gender) {
				await user.setGender(
					userInformation.gender == 'male' ? 'Man' : 'Woman',
				);
			}
			if (userInformation.birthday) {
				user.setBirthday(new Date(userInformation.birthday).getTime());
				await user.update();
			}
			const jwt = await this.authService.getJwt(user);
			res.send(this.oauthService.scriptValue(jwt));
			return;
		}
		const user = await oauth.getUser();
		const jwt = await this.authService.getJwt(user);
		res.send(this.oauthService.scriptValue(jwt));
	}

	@Api('link')
	@UseGuards('auth')
	@Put('link')
	async link(
		@Request() req: IUserLogin,
		@Body() link: LinkOauthDto,
	): Promise<void> {
		const oauthService = new DbService();
		const oauth = await oauthService.getByOauthId(link.idProvider);
		if (oauth.getUserId() == undefined) {
			oauth.setUser(req.user);
			await oauth.update();
		}
	}

	@Api('unlink')
	@UseGuards('auth')
	@Delete('unlink')
	async unlink(
		@Request() req: IUserLogin,
		@Body() link: LinkOauthDto,
	): Promise<void> {
		const oauthService = new DbService();
		const oauth = await oauthService.getByOauthId(link.idProvider);
		if (oauth.getUserId() == req.user.getId()) {
			await oauth.delete();
		}
	}
}

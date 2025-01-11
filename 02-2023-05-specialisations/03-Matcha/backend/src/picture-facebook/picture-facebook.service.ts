import { DbService } from '$app/auth/oauth/db/db.service';
import {
	IFacebookMe,
	IFacebookOauth,
	IFacebookPermission,
	IFacebookPhotos,
} from '$app/auth/oauth/oauth.interface';
import { UserService } from '$app/user/user.service';
import {
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import {
	DataPictureFacebook,
	PictureFacebookId,
} from './picture-facebook.schema';

@Injectable()
export class PictureFacebookService {
	static baseURL: string = 'https://graph.facebook.com/v20.0';

	async facebookGetPermission(
		token: IFacebookOauth,
	): Promise<{ data: IFacebookPermission[] }> {
		const url = new URL(`${PictureFacebookService.baseURL}/me/permissions`);
		url.searchParams.append('access_token', token.access_token);
		return await fetch(url.toString())
			.then(async (res) => await res.json())
			.catch((err) => err);
	}

	async facebookGetPhotos(
		token: IFacebookOauth,
		user: IFacebookMe,
	): Promise<IFacebookPhotos> {
		const url = new URL(
			`${PictureFacebookService.baseURL}/${user.id}/photos`,
		);
		url.searchParams.append('access_token', token.access_token);
		url.searchParams.append('type', 'uploaded');
		url.searchParams.append('fields', 'images');
		return await fetch(url.toString())
			.then(async (res) => await res.json())
			.catch((err) => err);
	}

	async rightReadPictureFacebook(
		user: UserService,
		getToken: boolean = false,
	): Promise<void | IFacebookOauth> {
		const dbService = new DbService();
		const oauth = (await user.getOauth()).filter(
			(o) => o.provider == 'Facebook',
		);
		if (oauth.length == 0) {
			throw new ForbiddenException('Please link account facebook');
		}
		const id_oauth = oauth[0].id_provider;
		const oauthFacebook = await dbService.getByOauthId(id_oauth);
		if (oauthFacebook.isExpired()) {
			throw new UnauthorizedException(
				'Token facebook is expired please relogin',
			);
		}
		const token = {
			access_token: oauthFacebook.getAccessToken(),
			token_type: oauthFacebook.getTokenType(),
			expires_in: oauthFacebook.getExpiresIn(),
		};
		const rights = await this.facebookGetPermission(token);
		const user_photos = rights.data.filter(
			(d) => d.permission == 'user_photos',
		);
		if (user_photos.length != 1 || user_photos[0].status != 'granted') {
			throw new ForbiddenException('Please add access picture facebook');
		}
		if (getToken) return token;
	}

	async getBeforeAfter(
		token: IFacebookOauth,
		user: IFacebookMe,
		tokenCursors: string,
		isBefore: boolean,
	): Promise<IFacebookPhotos> {
		const url = new URL(
			`${PictureFacebookService.baseURL}/${user.id}/photos`,
		);
		url.searchParams.append('access_token', token.access_token);
		url.searchParams.append('type', 'uploaded');
		url.searchParams.append('fields', 'images');
		url.searchParams.append('limit', '25');
		if (isBefore) {
			url.searchParams.append('before', tokenCursors);
		} else {
			url.searchParams.append('after', tokenCursors);
		}
		return await fetch(url.toString())
			.then(async (res) => await res.json())
			.catch((err) => err);
	}

	normalizeValue(dataPicture: IFacebookPhotos): DataPictureFacebook {
		const { data, paging } = dataPicture;
		const { cursors, ...values } = paging;
		if (!values?.next) {
			delete cursors.after;
		}
		if (!values?.previous) {
			delete cursors.before;
		}
		return {
			data,
			cursors,
		};
	}

	async getPictureFacebook(
		token: IFacebookOauth,
		idPictureFacebook: string,
	): Promise<PictureFacebookId> {
		const url = new URL(
			`${PictureFacebookService.baseURL}/${idPictureFacebook}`,
		);
		url.searchParams.append('access_token', token.access_token);
		url.searchParams.append('fields', 'images');
		return await fetch(url.toString())
			.then(async (res) => await res.json())
			.catch((err) => err);
	}
}

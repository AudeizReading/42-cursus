import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OauthInformation } from './oauth.schema';
import { URL } from 'url';
import {
	IFacebookMe,
	IFacebookOauth,
	IGoogleMe,
	IGoogleOauth,
} from './oauth.interface';
import { IJWT } from '../auth.interface';

@Injectable()
export class OauthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly loggerService: Logger,
	) {}

	googleInformation(createUser: boolean = true): OauthInformation {
		const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
		url.searchParams.append('response_type', 'code');
		url.searchParams.append(
			'client_id',
			this.configService.get('oauth.google.public'),
		);
		url.searchParams.append(
			'redirect_uri',
			this.configService.get('oauth.google.redirect_uri'),
		);
		const scopes = [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
		];
		url.searchParams.append('scope', scopes.join(' '));
		if (createUser == false) {
			url.searchParams.append(
				'state',
				JSON.stringify({ createUser: false }),
			);
		}
		return {
			name: 'Google',
			url: url.toString(),
		};
	}

	private async codeToToken<T>(url: string, data: unknown): Promise<T> {
		return await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
		})
			.then(async (res) => await res.json())
			.catch((err) => err);
	}

	async googleCodeToToken(code: string): Promise<IGoogleOauth> {
		const data = {
			code,
			client_id: this.configService.get('oauth.google.public'),
			client_secret: this.configService.get('oauth.google.secret'),
			redirect_uri: this.configService.get('oauth.google.redirect_uri'),
			grant_type: 'authorization_code',
		};
		return await this.codeToToken<IGoogleOauth>(
			'https://oauth2.googleapis.com/token',
			data,
		);
	}

	async googleGetMe(token: IGoogleOauth): Promise<IGoogleMe> {
		return await fetch(
			'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
			{
				method: 'GET',
				headers: {
					Authorization: `${token.token_type} ${token.access_token}`,
				},
			},
		)
			.then(async (res) => await res.json())
			.catch((err) => err);
	}

	facebookInformation(createUser: boolean = true): OauthInformation {
		const url = new URL('https://www.facebook.com/v20.0/dialog/oauth');
		url.searchParams.append(
			'client_id',
			this.configService.get('oauth.facebook.public'),
		);
		url.searchParams.append(
			'redirect_uri',
			this.configService.get('oauth.facebook.redirect_uri'),
		);
		url.searchParams.append('response_type', 'code');
		url.searchParams.append('auth_type', 'rerequest');
		url.searchParams.append(
			'scope',
			[
				'email',
				'public_profile',
				'user_photos',
				'user_birthday',
				'user_gender',
			].join(','),
		);
		if (createUser == false) {
			url.searchParams.append(
				'state',
				JSON.stringify({ createUser: false }),
			);
		}
		return {
			name: 'Facebook',
			url: url.toString(),
		};
	}

	async facebookCodeToToken(code: string): Promise<IFacebookOauth> {
		const url = new URL(
			'https://graph.facebook.com/v20.0/oauth/access_token',
		);
		url.searchParams.append(
			'client_id',
			this.configService.get('oauth.facebook.public'),
		);
		url.searchParams.append(
			'client_secret',
			this.configService.get('oauth.facebook.secret'),
		);
		url.searchParams.append(
			'redirect_uri',
			this.configService.get('oauth.facebook.redirect_uri'),
		);
		url.searchParams.append('code', code);
		return await fetch(url)
			.then(async (res) => await res.json())
			.catch((err) => err);
	}

	async facebookGetMe(token: IFacebookOauth): Promise<IFacebookMe> {
		const url = new URL('https://graph.facebook.com/v20.0/me');
		url.searchParams.append(
			'fields',
			[
				'id',
				'name',
				'email',
				'first_name',
				'last_name',
				'picture',
				'birthday',
				'gender',
			].join(','),
		);
		url.searchParams.append('access_token', token.access_token);
		return await fetch(url.toString())
			.then(async (res) => await res.json())
			.catch((err) => err);
	}

	scriptValue(
		userInformation: IGoogleMe | IFacebookMe | IJWT | unknown,
	): string {
		const script = `
        <script>
			window.localStorage.setItem("oauth", '${JSON.stringify(userInformation)}');
        	window.close();
        </script>
      `;
		this.loggerService.debug(script);
		return script;
	}
}

import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OauthMiddlewareDatas, OauthRTO, OauthSocialMediaTypes, OauthStatusDTO } from '@app/models';
import { ApiService, LoggerService, ProfileService } from '@app/shared';
import { filter, Observable, of, switchMap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class OauthService {
	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
		private profileService: ProfileService,
	) {}

	public getOauth(isComingFromSettings: boolean = false): Observable<OauthRTO[]> {
		try {
			if (isComingFromSettings) {
				return this.apiService.get('v1.oauth.endpoint', { query: { createUser: 'false' } }) as Observable<
					OauthRTO[]
				>;
			} else {
				return this.apiService.get('v1.oauth.endpoint') as Observable<OauthRTO[]>;
			}
		} catch (error) {
			this.logger.handleError<unknown>('oauth endpoint', null);
		}
		return of({}) as Observable<OauthRTO[]>;
	}

	public getGoogleOauth(code: string): Observable<unknown> {
		try {
			return this.apiService.get('v1.oauth.google', { query: { code } }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>('oauth google', null);
		}
		return of({}) as Observable<unknown>;
	}

	public getFacebookOauth(code: string): Observable<unknown> {
		try {
			return this.apiService.get('v1.oauth.facebook', { query: { code } }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>('oauth facebook', null);
		}
		return of({}) as Observable<unknown>;
	}

	public getSocialMediaOauth(code: string, type: OauthSocialMediaTypes): Observable<unknown> {
		try {
			return this.apiService.get(`v1.oauth.${type}`, { query: { code } }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`v1.oauth.${type}`, { query: { code } });
		}
		return of({}) as Observable<unknown>;
	}

	public linkAccount(providerPayload: OauthMiddlewareDatas): Observable<OauthStatusDTO | null> {
		return this.profileService.getProfile().pipe(
			switchMap((profile) => {
				if (profile) {
					let oauth: OauthStatusDTO | undefined;
					if (profile.oauth && profile.oauth.length > 0) {
						oauth = profile.oauth.find((o) => o.provider.toLowerCase() === providerPayload.type);
					}
					if (!oauth) {
						oauth = {
							id_provider: providerPayload.providerDatas.id,
							id: String(profile.id),
							provider: providerPayload.type,
						};
						profile.oauth?.push(oauth) ?? (profile.oauth = [oauth]);
					}
					profile.oauth?.push(oauth) ?? (profile.oauth = [oauth]);
					this.profileService.emitProfile(profile);
					return this.apiService.put(`v1.oauth.link`, { body: { idProvider: oauth.id_provider } }).pipe(
						filter((payload) => payload instanceof HttpResponse),
						switchMap(() => of(oauth)),
					) as Observable<OauthStatusDTO>;
				}
				return of(null) as Observable<null>;
			}),
		);
	}

	public unlinkAccount(idProvider: string): Observable<unknown> {
		try {
			return this.apiService.delete(`v1.oauth.unlink`, { body: { idProvider } }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>('v1.oauth.unlink');
		}
		return of({}) as Observable<unknown>;
	}
}

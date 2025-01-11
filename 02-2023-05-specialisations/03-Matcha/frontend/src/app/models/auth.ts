import { AlertService, OauthService } from '@app/shared';
import { AlertFacade, ApiBody, WindowSettings } from '.';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface RegistrationDTO extends ApiBody {
	username: string;
	firstName: string;
	lastName: string;
	password: string;
	email: string;
}

export interface LoginDTO extends ApiBody {
	username: string;
	password: string;
}

export interface AccessTokenDTO {
	access_token: string;
}

export interface AuthResponseDTO {
	message: string;
}

export interface OauthRTO {
	[key: string]: string;
	name: string;
	url: string;
}

export type OauthSocialMediaTypes = 'google' | 'facebook';

export interface OauthStatusDTO {
	id: string;
	id_provider: string;
	provider: string;
}

export interface IPictureFacebook {
	height: number;
	is_silhouette: boolean;
	url: string;
	width: number;
}

export interface IFacebookMe {
	id: string;
	name: string;
	first_name: string;
	last_name: string;
	picture: {
		data: IPictureFacebook;
	};
	email?: string;
	birthday?: string;
	gender?: 'male' | 'female';
}

export interface IGoogleMe {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
}

export type OauthProviderDTO = IFacebookMe | IGoogleMe;

export function isFacebookMe(value: OauthProviderDTO): value is IFacebookMe {
	return (
		(value as IFacebookMe).id !== undefined &&
		'id' in value &&
		'name' in value &&
		'first_name' in value &&
		'last_name' in value &&
		'picture' in value &&
		'data' in (value as IFacebookMe).picture &&
		'url' in (value as IFacebookMe).picture.data &&
		'height' in (value as IFacebookMe).picture.data &&
		'width' in (value as IFacebookMe).picture.data &&
		'is_silhouette' in (value as IFacebookMe).picture.data &&
		'email' in value &&
		'birthday' in value &&
		'gender' in value
	);
}

export function isGoogleMe(value: OauthProviderDTO): value is IGoogleMe {
	return (
		(value as IGoogleMe).id !== undefined &&
		'id' in value &&
		'email' in value &&
		'verified_email' in value &&
		'name' in value &&
		'given_name' in value &&
		'family_name' in value &&
		'picture' in value
	);
}

export function isOauthProviderDTO(value: unknown): value is OauthProviderDTO {
	return isFacebookMe(value as unknown as OauthProviderDTO) || isGoogleMe(value as unknown as OauthProviderDTO);
}

export interface OauthMiddlewareDatas {
	type: OauthSocialMediaTypes;
	next: () => void;
	providerDatas: OauthProviderDTO;
}

export class OauthBase extends AlertFacade {
	private oauthName: string | undefined;
	private oauthUrl: string | undefined;
	private provider: OauthStatusDTO | undefined;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		alertService: AlertService,
		private oauthService: OauthService,
		private oauthOpts: string,
	) {
		super(alertService);
	}

	protected getOauthBaseDatas(type: OauthSocialMediaTypes, isComingFromSettings: boolean = false): void {
		this.oauthService
			.getOauth(isComingFromSettings)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (oauth) => {
					const { name, url } = oauth?.find((oauth) => oauth.name.toLowerCase() === type) || {
						name: '',
						url: '',
					};
					this.oauthName = name;
					this.oauthUrl = url;
				},
				error: (error) => {
					if (error.status >= 400) {
						this.alert('error', 'Ouuupsie, something went wrong!');
					}
				},
			});
	}

	protected pipeOauthBaseDatas(
		type: OauthSocialMediaTypes,
		isComingFromSettings: boolean = false,
	): Observable<WindowSettings | null> {
		return this.oauthService.getOauth(isComingFromSettings).pipe(
			switchMap((oauth) => {
				const { name, url } = oauth?.find((oauth) => oauth.name.toLowerCase() === type) || {
					name: '',
					url: '',
				};
				this.oauthName = name;
				this.oauthUrl = url;
				return of(this.settings);
			}),
		);
	}

	protected get settings(): WindowSettings | null {
		if (this.oauthName && this.oauthUrl) {
			return { name: this.oauthName, url: this.oauthUrl, options: this.oauthOpts };
		} else {
			return null;
		}
	}

	protected linkAccount(providerPayload: OauthMiddlewareDatas): void {
		this.oauthService
			.linkAccount(providerPayload)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload) => {
					if (payload && 'id' in payload) {
						this.provider = { ...payload };
						this.alert('success', 'You have successfully linked your account');
						providerPayload.next();
					} else {
						this.alert('error', 'Ouuupsie, something went wrong while linking your account');
					}
				},
			});
	}

	protected set oauthStatus(oauth: OauthStatusDTO | undefined) {
		if (oauth) {
			this.provider = { ...oauth };
		}
	}

	protected unLinkAccount(next: () => void): void {
		if (!this.provider) {
			return;
		}
		this.oauthService
			.unlinkAccount(this.provider.id_provider)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload) => {
					if (payload instanceof HttpResponse) {
						this.alert('success', 'You have successfully unlinked your account');
						next();
					} else if (payload instanceof HttpErrorResponse) {
						this.alert('error', 'Ouuupsie, something went wrong while unlinking your account');
					}
				},
			});
	}
}

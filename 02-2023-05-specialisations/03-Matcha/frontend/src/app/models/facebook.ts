import { AlertService, FacebookService, OauthService } from '@app/shared';
import { OauthBase, OauthSocialMediaTypes, WindowSettings } from '.';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

export interface FacebookCursors {
	before: string | undefined;
	after: string | undefined;
}

export type ToBoolean<T> = {
	[K in keyof T]: T[K] extends string | undefined ? boolean : T[K];
};

export type FacebookBooleanCursors = ToBoolean<FacebookCursors>;

export interface FacebookPictureResponseDTO {
	data: [
		{
			id: string;
			images: [
				{
					height: number;
					source: string;
					width: number;
				},
			];
		},
	];
	cursors: FacebookCursors;
}

export class FacebookOauthFacade extends OauthBase {
	protected oauthType: OauthSocialMediaTypes = 'facebook';
	protected connect: boolean = false;

	public constructor(
		private facebookService: FacebookService,
		alertService: AlertService,
		oauthService: OauthService,
	) {
		super(alertService, oauthService, 'width=800,height=600');
	}

	protected getPicture(): Observable<FacebookPictureResponseDTO | WindowSettings | null | File[] | unknown> {
		return this.facebookService.getRight().pipe(
			catchError((payload) => {
				// 403 -> l'user a pas relié son compte fb
				// 401 -> token expiré
				if (payload.status === 403 || payload.status === 401) {
					this.connect = true;
					return this.pipeOauthBaseDatas(this.oauthType, true);
				}
				return of(payload);
			}),
			switchMap((payload) => {
				if (payload instanceof HttpResponse || payload === null) {
					this.connect = false;
					return this.facebookService
						.getPicture()
						.pipe(switchMap((data) => this.facebookService.convertPicturesToFiles(data)));
				}
				this.connect = true;
				return of(payload);
			}),
		);
	}

	protected previousPicture(): Observable<FacebookPictureResponseDTO> {
		// eslint-disable-next-line no-useless-catch
		try {
			return this.facebookService.getRight().pipe(
				catchError((payload) => {
					// 403 -> l'user a pas relié son compte fb
					// 401 -> token expiré
					if (payload.status === 403 || payload.status === 401) {
						this.connect = true;
						return this.pipeOauthBaseDatas(this.oauthType, true);
					}
					return of(payload);
				}),
				switchMap((payload) => {
					if (payload instanceof HttpResponse || payload === null) {
						this.connect = false;
						return this.facebookService
							.getBeforePicture()
							.pipe(switchMap((data) => this.facebookService.convertPicturesToFiles(data)));
					}
					this.connect = true;
					return of(payload);
				}),
			);
		} catch (error) {
			throw error;
		}
	}

	protected nextPicture(): Observable<FacebookPictureResponseDTO> {
		// eslint-disable-next-line no-useless-catch
		try {
			return this.facebookService.getRight().pipe(
				catchError((payload) => {
					// 403 -> l'user a pas relié son compte fb
					// 401 -> token expiré
					if (payload.status === 403 || payload.status === 401) {
						this.connect = true;
						return this.pipeOauthBaseDatas(this.oauthType, true);
					}
					return of(payload);
				}),
				switchMap((payload) => {
					if (payload instanceof HttpResponse || payload === null) {
						this.connect = false;
						return this.facebookService
							.getAfterPicture()
							.pipe(switchMap((data) => this.facebookService.convertPicturesToFiles(data)));
					}
					this.connect = true;
					return of(payload);
				}),
			);
		} catch (error) {
			throw error;
		}
	}

	protected get prev(): boolean {
		return this.facebookService.fbCursors.before;
	}

	protected get next(): boolean {
		return this.facebookService.fbCursors.after;
	}
}

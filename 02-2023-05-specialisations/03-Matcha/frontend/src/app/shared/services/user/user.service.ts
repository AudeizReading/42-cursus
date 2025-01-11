/* eslint-disable @typescript-eslint/naming-convention */
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	ApiQuery,
	ProfileDTO,
	ChangePasswordByTokenBodyDTO,
	UserDescriptionBodyDTO,
	UserGenderBodyDTO,
	UserSexualPrefBodyDTO,
	AccessTokenDTO,
	UserViewsDTO,
	ApiBody,
	UserViewQueryDTO,
	UserVisitsDTO,
	UserVisitedQueryDTO,
	UserLikeQueryDTO,
	UserLikedQueryDTO,
	UserMatchQueryDTO,
	UserMatchesDTO,
	UserLikedDTO,
	UserLikesDTO,
	UserLocationTypeDTO,
	UserBirthdayDTO,
	LocationType,
	CountResponseDTO,
	UserResponseDTO,
	UserHasInteractedResponseDTO,
	UserStatsResponseDTO,
	UpdatePublicProfileAPIQuery,
	UpdatePrivateProfileAPIQuery,
} from '@app/models';
import { ApiService, LoggerService } from '@app/shared';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
	) {}

	[key: string]:
		| ((limit: number, page: number) => Observable<CountResponseDTO | UserResponseDTO>)
		| Observable<CountResponseDTO | UserResponseDTO>
		| unknown;

	public changePasswordByToken(token: string, newPassword: string): Observable<AccessTokenDTO> {
		try {
			return this.apiService.put<ApiQuery, ChangePasswordByTokenBodyDTO>('v1.user.changePassword', {
				body: { token, newPassword },
			}) as Observable<AccessTokenDTO>;
		} catch (error) {
			this.logger.handleError<ChangePasswordByTokenBodyDTO>('v1.user.changePassword', { token, newPassword });
		}
		return of({ token, newPassword }) as unknown as Observable<AccessTokenDTO>;
	}

	public updateDefaultPicture(id: string): Observable<unknown> {
		try {
			return this.apiService.put('v1.user.defaultPicture', {
				params: id,
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<{ id: string }>('v1.user.defaultPicture', { id });
		}
		return of({ id }) as unknown as Observable<{ id: string }>;
	}

	public updateDescription(description: string): Observable<unknown> {
		try {
			return this.apiService.put<ApiQuery, UserDescriptionBodyDTO>('v1.user.description', {
				body: { description },
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<UserDescriptionBodyDTO>('v1.user.description', { description });
		}
		return of({ description }) as unknown as Observable<UserDescriptionBodyDTO>;
	}

	public updateGender(gender: string): Observable<unknown> {
		try {
			return this.apiService.put<ApiQuery, UserGenderBodyDTO>('v1.user.gender', {
				body: { gender },
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<UserGenderBodyDTO>('v1.user.gender', { gender });
		}
		return of({ gender }) as unknown as Observable<UserGenderBodyDTO>;
	}

	public updateSexualPreference(sexualPreference: string): Observable<unknown> {
		try {
			return this.apiService.put<ApiQuery, UserSexualPrefBodyDTO>('v1.user.sexualPreference', {
				body: { sexualPreference },
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<UserSexualPrefBodyDTO>('v1.user.sexualPreference', { sexualPreference });
		}
		return of({ sexualPreference }) as unknown as Observable<UserSexualPrefBodyDTO>;
	}

	public updateLocationType(locationType: string | LocationType): Observable<unknown> {
		try {
			return this.apiService.put<ApiQuery, UserLocationTypeDTO>('v1.user.locationType', {
				body: { locationType },
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<UserLocationTypeDTO>('v1.user.locationType', { locationType });
		}
		return of({ locationType }) as unknown as Observable<UserLocationTypeDTO>;
	}

	// send the birthday as a timestamp
	public updateBirthday(birthday: number): Observable<unknown> {
		try {
			return this.apiService.put<ApiQuery, UserBirthdayDTO>('v1.user.birthday', {
				body: { birthday },
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<UserBirthdayDTO>('v1.user.birthday', { birthday });
		}
		return of({ birthday }) as unknown as Observable<UserBirthdayDTO>;
	}

	public updateProfile(
		profile: Partial<ProfileDTO> | UpdatePublicProfileAPIQuery | UpdatePrivateProfileAPIQuery,
	): Observable<HttpResponse<ProfileDTO>> {
		try {
			return this.apiService.put<
				ApiQuery,
				Partial<ProfileDTO> | UpdatePublicProfileAPIQuery | UpdatePrivateProfileAPIQuery
			>('v1.user.endpoint', {
				body: { ...profile },
			}) as Observable<HttpResponse<ProfileDTO>>;
		} catch (error) {
			this.logger.handleError<Partial<ProfileDTO> | UpdatePublicProfileAPIQuery | UpdatePrivateProfileAPIQuery>(
				'v1.user.endpoint',
				{
					...profile,
				},
			);
		}
		return of({ profile }) as unknown as Observable<HttpResponse<ProfileDTO>>;
	}

	public getView(limit: number = 5, page: number = 0): Observable<UserViewsDTO[]> {
		try {
			return this.apiService.get<UserViewQueryDTO, ApiBody>('v1.user.view.endpoint', {
				query: { limit, page },
			}) as Observable<UserViewsDTO[]>;
		} catch (error) {
			this.logger.handleError<UserViewQueryDTO>('v1.user.view.endpoint', { limit, page });
		}
		return of(null) as unknown as Observable<UserViewsDTO[]>;
	}

	public hasViewed(userId: string): Observable<UserHasInteractedResponseDTO> {
		try {
			return this.apiService.get<UserMatchQueryDTO, ApiBody>('v1.user.view.id', {
				params: userId,
			}) as Observable<UserHasInteractedResponseDTO>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('v1.user.view.id', {
				params: userId,
			});
		}
		return of(null) as unknown as Observable<UserHasInteractedResponseDTO>;
	}

	public getVisited(limit: number = 5, page: number = 0): Observable<UserVisitsDTO[]> {
		try {
			return this.apiService.get<UserVisitedQueryDTO, ApiBody>('v1.user.visited.endpoint', {
				query: { limit, page },
			}) as Observable<UserVisitsDTO[]>;
		} catch (error) {
			this.logger.handleError<UserVisitedQueryDTO>('v1.user.view.visited', { limit, page });
		}
		return of(null) as unknown as Observable<UserVisitsDTO[]>;
	}

	public hasBeenVisitedBy(userId: string): Observable<UserHasInteractedResponseDTO> {
		try {
			return this.apiService.get<UserMatchQueryDTO, ApiBody>('v1.user.visited.id', {
				params: userId,
			}) as Observable<UserHasInteractedResponseDTO>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('v1.user.visited.id', {
				params: userId,
			});
		}
		return of(null) as unknown as Observable<UserHasInteractedResponseDTO>;
	}

	public getLike(limit: number = 5, page: number = 0): Observable<UserLikesDTO[]> {
		try {
			return this.apiService.get<UserLikeQueryDTO, ApiBody>('v1.user.like.endpoint', {
				query: { limit, page },
			}) as Observable<UserLikesDTO[]>;
		} catch (error) {
			this.logger.handleError<UserLikeQueryDTO>('v1.user.like.endpoint', { limit, page });
		}
		return of(null) as unknown as Observable<UserLikesDTO[]>;
	}

	public hasLiked(userId: string): Observable<UserHasInteractedResponseDTO> {
		try {
			return this.apiService.get<UserMatchQueryDTO, ApiBody>('v1.user.like.id', {
				params: userId,
			}) as Observable<UserHasInteractedResponseDTO>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('v1.user.like.id', {
				params: userId,
			});
		}
		return of(null) as unknown as Observable<UserHasInteractedResponseDTO>;
	}

	public getLiked(limit: number = 5, page: number = 0): Observable<UserLikedDTO[]> {
		try {
			return this.apiService.get<UserLikedQueryDTO, ApiBody>('v1.user.liked.endpoint', {
				query: { limit, page },
			}) as Observable<UserLikedDTO[]>;
		} catch (error) {
			this.logger.handleError<UserLikedQueryDTO>('v1.user.liked.endpoint', { limit, page });
		}
		return of(null) as unknown as Observable<UserLikedDTO[]>;
	}

	public hasBeenLikedBy(userId: string): Observable<UserHasInteractedResponseDTO> {
		try {
			return this.apiService.get<UserMatchQueryDTO, ApiBody>('v1.user.liked.id', {
				params: userId,
			}) as Observable<UserHasInteractedResponseDTO>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('v1.user.liked.id', {
				params: userId,
			});
		}
		return of(null) as unknown as Observable<UserHasInteractedResponseDTO>;
	}

	public getMatch(limit: number = 5, page: number = 0): Observable<UserMatchesDTO[]> {
		try {
			return this.apiService.get<UserMatchQueryDTO, ApiBody>('v1.user.match.endpoint', {
				query: { limit, page },
			}) as Observable<UserMatchesDTO[]>;
		} catch (error) {
			this.logger.handleError<UserMatchQueryDTO>('v1.user.match.endpoint', { limit, page });
		}
		return of(null) as unknown as Observable<UserMatchesDTO[]>;
	}

	public getStats(): Observable<UserStatsResponseDTO> {
		try {
			return this.apiService.get<UserMatchQueryDTO, ApiBody>('v1.user.stats') as Observable<UserStatsResponseDTO>;
		} catch (error) {
			this.logger.handleError<UserStatsResponseDTO>('v1.user.stats');
		}
		return of(null) as unknown as Observable<UserStatsResponseDTO>;
	}

	public matches(limit: number = 5, page: number = 0): Observable<ProfileDTO[]> {
		try {
			return this.apiService.get<UserMatchQueryDTO, ApiBody>('v1.user.match.endpoint', {
				query: { limit, page },
			}) as Observable<ProfileDTO[]>;
		} catch (error) {
			this.logger.handleError<UserMatchQueryDTO>('v1.user.match.endpoint', { limit, page });
		}
		return of(null) as unknown as Observable<ProfileDTO[]>;
	}

	public hasMatched(userId: string): Observable<UserHasInteractedResponseDTO> {
		try {
			return this.apiService.get<UserMatchQueryDTO, ApiBody>('v1.user.matches.id', {
				params: userId,
			}) as Observable<UserHasInteractedResponseDTO>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('v1.user.matches.id', {
				params: userId,
			});
		}
		return of(null) as unknown as Observable<UserHasInteractedResponseDTO>;
	}
}

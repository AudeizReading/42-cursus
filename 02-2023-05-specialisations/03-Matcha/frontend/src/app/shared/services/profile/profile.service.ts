import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MandatoryProfileDatasDTO, ProfileDTO, StorageKey } from '@app/models';

import { ApiService, LoggerService, ProfileCompletedService, StorageEventService, StorageService } from '@app/shared';
import { Observable, catchError, filter, map, of, switchMap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ProfileService {
	public profile$ = this.profileCompletedService.profile$;
	public profileCompleted$ = this.profileCompletedService.profileCompleted$;

	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private logger: LoggerService,
		private apiService: ApiService,
		private storageEventService: StorageEventService,
		private storageService: StorageService,
		private profileCompletedService: ProfileCompletedService,
	) {
		this.onJwtEmitProfile();
	}

	private onJwtEmitProfile(): void {
		this.storageEventService
			.getStorageSubject(StorageKey.ACCESS_TOKEN)
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				switchMap(() => {
					return this.getProfile().pipe(
						takeUntilDestroyed(this.destroyRef),
						switchMap((data) => {
							this.emitProfile(data);
							return of(data); // Return an observable
						}),
						catchError(() => {
							this.storageService.logout();
							return of(null); // Return an observable
						}),
					);
				}),
			)
			.subscribe();
	}

	public emitProfile(profile: ProfileDTO): void {
		this.getProfileStatus()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((status) => {
				const isComplete = Object.values(status).every((value) => value);
				this.profileCompletedService.emitProfile(profile);
				this.emitProfileCompleted(isComplete);
			});
	}

	public emitProfileCompleted(status: boolean): void {
		this.profileCompletedService.emitProfileCompleted(status);
	}

	public getProfile(): Observable<ProfileDTO> {
		try {
			return this.apiService.get('v1.profile.me') as Observable<ProfileDTO>;
		} catch (error) {
			this.logger.handleError<ProfileDTO>('v1.profile me', {} as ProfileDTO);
		}
		return of({}) as Observable<ProfileDTO>;
	}

	public getProfileStatus(): Observable<MandatoryProfileDatasDTO> {
		try {
			return this.apiService.get('v1.profile.endpoint') as Observable<MandatoryProfileDatasDTO>;
		} catch (error) {
			this.logger.handleError<unknown>(`profile not complete`, null);
		}
		return of({}) as Observable<MandatoryProfileDatasDTO>;
	}

	public isAPIComplete(): Observable<boolean> {
		return this.getProfileStatus().pipe(
			filter((status) => Object.values(status).every((value) => value)),
			map(() => true),
			catchError(() => of(false)),
		);
	}

	public getProfileById(id: string): Observable<ProfileDTO> {
		try {
			return this.apiService.get('v1.profile.id.endpoint', { params: id }) as Observable<ProfileDTO>;
		} catch (error) {
			this.logger.handleError<unknown>(`profile ${id}`, null);
		}
		return of({}) as Observable<ProfileDTO>;
	}

	public addView(id: string): Observable<unknown> {
		try {
			return this.apiService.put('v1.profile.id.view', { params: id + '/view' }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`profile ${id}`, { params: id + '/view' });
		}
		return of({}) as Observable<unknown>;
	}

	public addLike(id: string): Observable<unknown> {
		try {
			return this.apiService.put('v1.profile.id.like', { params: id + '/like' }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`profile ${id}`, null);
		}
		return of({}) as Observable<unknown>;
	}

	public dislike(id: string): Observable<unknown> {
		try {
			return this.apiService.put('v1.profile.id.dislike', { params: id + '/dislike' }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`profile ${id}`, null);
		}
		return of({}) as Observable<unknown>;
	}

	public removeLike(id: string): Observable<unknown> {
		try {
			return this.apiService.put('v1.profile.id.unlike', { params: id + '/unlike' }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`profile ${id}`, null);
		}
		return of({}) as Observable<unknown>;
	}

	public block(id: string): Observable<unknown> {
		try {
			return this.apiService.put('v1.profile.id.block', { params: id + '/block' }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`profile ${id}`, null);
		}
		return of({}) as Observable<unknown>;
	}

	public unblock(id: string): Observable<unknown> {
		try {
			return this.apiService.put('v1.profile.id.unblock', { params: id + '/unblock' }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`profile ${id}`, null);
		}
		return of({}) as Observable<unknown>;
	}

	public report(id: string): Observable<unknown> {
		try {
			return this.apiService.put('v1.profile.id.report', { params: id + '/report' }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`profile ${id}`, null);
		}
		return of({}) as Observable<unknown>;
	}
}

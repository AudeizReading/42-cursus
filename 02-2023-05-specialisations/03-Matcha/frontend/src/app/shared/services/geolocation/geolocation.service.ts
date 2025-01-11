import { HttpResponse } from '@angular/common/http';
import { DestroyRef, inject, Inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocationService, ProfileService, UserService } from '@app/shared';
import { GEOLOCATION, GEOLOCATION_SUPPORT, PERMISSIONS, POSITION_OPTIONS } from '@app/shared/tokens';
import { BehaviorSubject, Observable, filter, of, switchMap, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class GeolocationService {
	private positionSubject = new BehaviorSubject<GeolocationPosition | null>(null);
	public position$: Observable<GeolocationPosition | null> = this.positionSubject.asObservable();
	private watchId: number | null = null;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		@Inject(GEOLOCATION) private readonly geolocationRef: Geolocation,
		@Inject(GEOLOCATION_SUPPORT) private readonly geolocationSupported: boolean,
		@Inject(POSITION_OPTIONS) private readonly positionOptions: PositionOptions,
		@Inject(PERMISSIONS) private readonly permissions: Permissions,
		private readonly userService: UserService,
		private readonly locationService: LocationService,
		private readonly profileService: ProfileService,
	) {}

	public get geoPermission(): Promise<PermissionStatus> {
		return this.permissions.query({ name: 'geolocation' });
	}

	public startTracking(): void {
		if (!this.geolocationSupported) {
			throw new Error('Geolocation is not supported in your browser');
		}

		if (this.watchId !== null) {
			this.stopTracking();
		}
		this.watchId = this.geolocationRef.watchPosition(
			(position) => {
				if (position !== null) {
					this.notifyBackend(position)
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe({
							next: (response) => {
								if (response !== null) {
									this.positionSubject.next(position);
								}
							},
						});
				}
			},
			(error) => {
				if (error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED) {
					this.profileService
						.getProfile()
						.pipe(
							takeUntilDestroyed(this.destroyRef),
							filter((profile) => profile.locationType === 'NAVIGATOR'),
							switchMap(() => {
								return this.resetToIP();
							}),
						)
						.subscribe({
							next: () => {
								this.positionSubject.error(error);
							},
						});
				} else {
					this.startTracking();
				}
			},
			this.positionOptions,
		);
	}

	public stopTracking(): void {
		if (this.watchId !== null) {
			this.geolocationRef.clearWatch(this.watchId);
			this.watchId = null;
		}
	}

	public getCurrentPosition(): Promise<GeolocationPosition> {
		return new Promise((resolve, reject) => {
			this.geolocationRef.getCurrentPosition(resolve, reject, this.positionOptions);
		});
	}

	public notifyBackend(position: GeolocationPosition): Observable<unknown> {
		return this.userService.updateLocationType('NAVIGATOR').pipe(
			takeUntilDestroyed(this.destroyRef),
			filter((response) => response instanceof HttpResponse),
			switchMap((response) => {
				if (response instanceof HttpResponse) {
					return this.locationService.updateNavigatorLocation(
						position.coords.latitude,
						position.coords.longitude,
					);
				} else {
					return of(null);
				}
			}),
			switchMap((response) => {
				if (response instanceof HttpResponse) {
					return this.profileService.getProfile();
				} else {
					return of(null);
				}
			}),
			tap((response) => {
				if (response !== null) {
					this.profileService.emitProfile(response);
				}
			}),
		);
	}

	public resetToIP(): Observable<unknown> {
		return this.userService.updateLocationType('IP').pipe(
			takeUntilDestroyed(this.destroyRef),
			filter((response) => response instanceof HttpResponse),
			switchMap((response) => {
				if (response instanceof HttpResponse) {
					return this.profileService.getProfile();
				} else {
					return of(null);
				}
			}),
			tap((response) => {
				if (response !== null) {
					this.profileService.emitProfile(response);
				}
			}),
		);
	}
}

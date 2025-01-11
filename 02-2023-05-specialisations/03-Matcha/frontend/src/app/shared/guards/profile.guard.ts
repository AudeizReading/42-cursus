import { Injectable, inject } from '@angular/core';
import { AlertService, ProfileService, StorageService } from '../services';
import { ActivatedRouteSnapshot, CanActivateFn, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, filter, first, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
class ProfileGuard {
	public constructor(
		private alertService: AlertService,
		private profileService: ProfileService,
		private storageService: StorageService,
	) {}

	public canActivate(router: Router): Observable<boolean> {
		return this.profileService.getProfileStatus().pipe(
			catchError((error) => {
				this.alertService.error(`Error while getting profile status ${JSON.stringify(error)}`);
				return of({} as Record<string, boolean>);
			}),
			switchMap((status) => {
				const isComplete = Object.values(status).every((value) => value);
				if (!isComplete && this.storageService.getUser()) {
					router.navigate(['/profile/registration'], {
						state: {
							code: 401,
							status: 'Unauthorized',
							message: 'Unauthorized',
							previousUrl: router.url ?? '/',
							currentUrl: router.url,
						},
					});
					return router.events.pipe(
						filter((event) => event instanceof NavigationEnd),
						first(),
						map(() => {
							this.alertService.error(`You must complete your profile`, {
								keepAfterRouteChange: true,
								autoClose: true,
								fade: true,
								open: true,
							});
							return false;
						}),
					);
				}
				return this.profileService.getProfile().pipe(
					map((profile) => {
						if (profile) {
							this.profileService.emitProfile(profile);
							router.getCurrentNavigation()!.extras.state = {
								previousUrl: router.url,
								currentUrl: router.url,
								code: 200,
								status: 'OK',
								message: 'Authorized',
							};
							// TODO: check si necessaire car depuis le remove du settimeout ca va mieux
							// potentiellement pas necessaire
							this.storageService.privateProfile = { ...profile };
						}
						return true;
					}),
					catchError((error) => {
						this.alertService.error(`Error while getting profile ${JSON.stringify(error)}`, {
							keepAfterRouteChange: true,
							autoClose: true,
							fade: true,
							open: true,
						});
						return of(false);
					}),
				);
			}),
		);
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const profileGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	return inject(ProfileGuard).canActivate(inject(Router));
};

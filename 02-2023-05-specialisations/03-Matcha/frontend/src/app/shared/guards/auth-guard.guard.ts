import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AlertService, StorageService } from '../services';

@Injectable({
	providedIn: 'root',
})
class AuthGuard {
	public constructor(
		private router: Router,
		private alertService: AlertService,
	) {}
	public canActivate(
		current: StorageService,
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
		router: Router,
	): boolean {
		const isLogged = current.isAuth();
		if (!isLogged) {
			router.navigate(['/error'], {
				state: {
					code: 401,
					status: 'Unauthorized',
					message: 'Unauthorized',
					previousUrl: '/',
					currentUrl: state.url,
				},
			});
			setTimeout(() => {
				this.alertService.error(`You can not access this page`, {
					keepAfterRouteChange: true,
					autoClose: true,
					fade: true,
					open: true,
				});
			}, 200);
		} else {
			router.getCurrentNavigation()!.extras.state = {
				previousUrl: router.url,
				currentUrl: state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			};
		}
		return isLogged;
	}
}

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	return inject(AuthGuard).canActivate(inject(StorageService), route, state, inject(Router));
};

@Injectable({
	providedIn: 'root',
})
class NotAuthGuard {
	public constructor(private alertService: AlertService) {}
	public canActivate(
		current: StorageService,
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
		router: Router,
	): boolean {
		const notLogged = !current.isAuth();
		if (!notLogged) {
			router.navigate(['/'], {
				state: {
					code: 403,
					status: 'Forbidden',
					message: 'You must be logged in to access this page',
					previousUrl: router.url ?? '/',
					currentUrl: state.url,
				},
			});
			setTimeout(() => {
				this.alertService.error(`You can not access this page`, {
					keepAfterRouteChange: true,
					autoClose: true,
					fade: true,
					open: true,
				});
			}, 200);
		}
		return notLogged;
	}
}

export const notAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	return inject(NotAuthGuard).canActivate(inject(StorageService), route, state, inject(Router));
};

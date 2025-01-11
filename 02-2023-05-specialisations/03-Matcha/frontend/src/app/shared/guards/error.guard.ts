import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
class ErrorGuard {
	public canActivate(state: RouterStateSnapshot, router: Router): boolean {
		router.getCurrentNavigation()!.extras.state = {
			code: 404,
			status: 'Not Found',
			message: 'Page Not Found',
			previousUrl: router.url,
			currentUrl: state.url,
		};

		return true;
	}
}

export const errorGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
	const router = inject(Router);
	const guard = inject(ErrorGuard);

	return guard.canActivate(state, router);
};

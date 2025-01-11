import { CanActivateFn } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AlertService, UserService } from '../services';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
class ChatGuard {
	public constructor(private alertService: AlertService) {}

	private redirectToChat(router: Router, state: RouterStateSnapshot, id: string): void {
		this.alertService.error(`User ${id} not found`, {
			keepAfterRouteChange: true,
			autoClose: true,
			fade: true,
			open: true,
		});
		router.navigate(['chat'], {
			state: {
				code: 404,
				status: 'Not Found',
				message: 'User not found',
				previousUrl: router.url,
				currentUrl: state.url,
			},
		});
	}

	public canActivate(
		current: UserService,
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
		router: Router,
	): Observable<boolean> {
		const userId = next.params['correspondantId'];
		if (!userId) {
			this.redirectToChat(router, state, userId);
			return of(false);
		}
		return current.hasMatched(userId).pipe(
			map((match) => {
				const { status } = match;
				return !!status;
			}),
			tap((hasMatched) => {
				if (!hasMatched) {
					this.redirectToChat(router, state, userId);
				} else {
					router.getCurrentNavigation()!.extras.state = {
						previousUrl: router.url,
						currentUrl: state.url,
						code: 200,
						status: 'OK',
						message: 'Authorized',
					};
				}
			}),
			catchError(() => {
				this.redirectToChat(router, state, userId);
				return of(false);
			}),
		);
	}
}

export const chatGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	return inject(ChatGuard).canActivate(inject(UserService), route, state, inject(Router));
};

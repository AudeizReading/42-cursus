import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Profile, ProfileDTO } from '@app/models';
import { ReplaySubject, Subject, share } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ProfileCompletedService {
	private state!: RouterStateSnapshot;
	private destroyRef: DestroyRef = inject(DestroyRef);
	private profileCompletedSubject = new Subject<boolean>();
	// share -> pour multicast l'observable: permet de suscribe l'event a plusieurs endroits du code
	public profileCompleted$ = this.profileCompletedSubject.asObservable().pipe(
		takeUntilDestroyed(this.destroyRef),
		share({
			connector: () => new ReplaySubject(1), // bufferize last message
		}),
	);

	public emitProfileCompleted(complete: boolean): void {
		this.profileCompletedSubject.next(complete);
	}

	private profileSubject = new Subject<ProfileDTO>();
	public profile$ = this.profileSubject.asObservable().pipe(
		takeUntilDestroyed(this.destroyRef),
		share({
			connector: () => new ReplaySubject(1), // bufferize last message
		}),
	);

	public emitProfile(profile: ProfileDTO): void {
		this.profileSubject.next(profile);
	}

	public constructor(private router: Router) {
		// trick to emit the profile when the jwt is set,
		// need this, otherwise profile$ would not be received by profile.component!
		this.state = this.router.routerState.snapshot;
		this.profile$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((profile) => {
			Profile.isComplete(profile) ||
				this.router.navigate(['/browsing'], {
					state: {
						previousUrl: this.router.url,
						currentUrl: this.state.url,
						code: 200,
						status: 'OK',
						message: 'Authorized',
					},
				});
			// routing sur -> /browsing et la, le profile guard prendra le relais et redirigera vers
			// profile/registration si necessaire
			this.emitProfileCompleted(Profile.isComplete(profile));
		});
	}
}

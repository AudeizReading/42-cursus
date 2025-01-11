import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { HeaderActionComponent } from '@app/components';
import { LayoutComponent } from '@app/layout';
import { AlertService, EmailValidationService, StorageService } from '@app/shared';
@Component({
	selector: 'app-email-validation',
	standalone: true,
	imports: [LayoutComponent, HeaderActionComponent],
	templateUrl: './email-validation.component.html',
	styleUrl: './email-validation.component.scss',
})
export class EmailValidationComponent implements OnInit {
	private state!: RouterStateSnapshot;
	public valid: boolean;
	private destroyRef: DestroyRef = inject(DestroyRef);
	public constructor(
		private route: ActivatedRoute,
		private router: Router,
		private emailValidationService: EmailValidationService,
		private storage: StorageService,
		private alertService: AlertService,
	) {
		this.valid = false;
		this.state = this.router.routerState.snapshot;
	}

	public ngOnInit(): void {
		const token = this.route.snapshot.params['token'] as string;
		// TODO: verif que le token est toujours valid!
		if (token) {
			this.emailValidationService
				.getValidation(token)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (data: unknown) => {
						// eslint-disable-next-line @typescript-eslint/naming-convention
						this.storage.saveUser(JSON.stringify((data as { access_token: string }).access_token));
						this.valid = true;
						setTimeout(() => {
							this.alertService.success('You have successfully validated your email!', {
								keepAfterRouteChange: true,
								autoClose: true,
								fade: true,
								open: true,
							});
							setTimeout(() => {
								this.router.navigate(['/'], {
									state: {
										previousUrl: this.router.url,
										currentUrl: this.state.url,
										code: 200,
										status: 'OK',
										message: 'Authorized',
									},
								});
							}, 5000);
						}, 200);
					},
					error: (error) => {
						this.valid = false;
						setTimeout(() => {
							this.alertService.error(error.error.message, {
								keepAfterRouteChange: true,
								autoClose: true,
								fade: true,
								open: true,
							});
							setTimeout(() => {
								this.router.navigate(['/'], {
									state: {
										previousUrl: this.router.url,
										currentUrl: this.state.url,
										code: 200,
										status: 'OK',
										message: 'Authorized',
									},
								});
							}, 5000);
						}, 200);
					},
				});
		}
	}
}

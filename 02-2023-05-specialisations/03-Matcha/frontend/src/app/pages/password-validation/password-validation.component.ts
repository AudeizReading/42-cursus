import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { HeaderActionComponent, InputComponent, InputIconComponent } from '@app/components';
import { LayoutComponent } from '@app/layout';
import { AlertService, StorageService, TokenService, UserService } from '@app/shared';

@Component({
	selector: 'app-password-validation',
	standalone: true,
	imports: [LayoutComponent, HeaderActionComponent, InputComponent, ReactiveFormsModule, InputIconComponent],
	templateUrl: './password-validation.component.html',
	styleUrl: './password-validation.component.scss',
})
export class PasswordValidationComponent implements OnInit {
	public form: FormGroup;
	public token: string | null;
	public message: string | null;
	private state!: RouterStateSnapshot;
	private destroyRef: DestroyRef = inject(DestroyRef);
	protected field: string = 'password';

	public constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private tokenService: TokenService,
		private userService: UserService,
		private storage: StorageService,
		private alertService: AlertService,
		private changeDetector: ChangeDetectorRef,
	) {
		this.token = null;
		this.form = this.formBuilder.group({});
		this.message = null;
		this.state = this.router.routerState.snapshot;
	}

	public ngOnInit(): void {
		this.message = null;
		this.token = this.route.snapshot.params['token'] as string;
		this.tokenService
			.isValid(this.token)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (data) => {
					if (data instanceof HttpResponse) {
						const response = data.body;
						if (response.expired === true) {
							this.message =
								'Your token is expired. You will be redirected to the password recovery page.';
							setTimeout(() => {
								this.router.navigate(['/recovery/password'], {
									state: {
										previousUrl: this.router.url,
										currentUrl: this.state.url,
										code: 200,
										status: 'OK',
										message: 'Authorized',
									},
								});
							}, 5000);
						}
					}
				},
			});
		this.form = this.formBuilder.group({
			newPassword: [''],
			reset: ['Reset'],
			submit: ['Submit'],
		});
	}

	public onSubmit(): void {
		const password = this.form.get('newPassword')?.value ?? '';
		if (this.token === null) return;
		this.userService
			.changePasswordByToken(this.token, password)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (response) => {
					if (response instanceof HttpResponse) {
						const body = response.body;
						// eslint-disable-next-line @typescript-eslint/naming-convention
						this.storage.saveUser((body as { access_token: string }).access_token);
						this.message = "Your new password has been set. You'll be redirected to the home page.";
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
					}
				},
				error: (error) => {
					setTimeout(() => {
						this.alertService.error(error.error.message, {
							keepAfterRouteChange: true,
							autoClose: true,
							fade: true,
							open: true,
						});
					}, 200);
				},
			});
	}
	public onReset(): void {
		this.form.reset({ submit: 'Submit', reset: 'Reset' });
		window.location.reload();
	}

	public onToggleEyeVisibility(): void {
		if (this.field === 'password') {
			this.field = 'text';
		} else if (this.field === 'text') {
			this.field = 'password';
		}
		this.changeDetector.detectChanges();
	}
}

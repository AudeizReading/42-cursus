import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService, AuthService, StorageService } from '@app/shared';
import { HttpResponse } from '@angular/common/http';
import { InputIconComponent } from '../input-icon/input-icon.component';
import { SigninComponent } from '../buttons/signin/signin.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-form-signin',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InputIconComponent, SigninComponent],
	templateUrl: './form-signin.component.html',
	styleUrl: './form-signin.component.scss',
})
export class FormSigninComponent implements OnInit {
	public signinForm!: FormGroup;
	protected field: string = 'password';
	@Output() public isLoggedEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public hasFailedEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private fb: FormBuilder,
		private auth: AuthService,
		private storage: StorageService,
		private alertService: AlertService,
		private changeDetector: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		this.signinForm = this.fb.group({
			username: ['', Validators.compose([Validators.required])],
			password: ['', Validators.compose([Validators.required])],
			signin: ['Sign In'],
		});
	}

	private alert(type: string, message: string): void {
		const opts = {
			keepAfterRouteChange: true,
			autoClose: true,
			fade: true,
			open: true,
		};
		switch (type) {
			case 'error':
				this.alertService.error(message, opts);
				break;
			case 'success':
				this.alertService.success(message, opts);
				break;
		}
	}

	public onToggleEyeVisibility(): void {
		if (this.field === 'password') {
			this.field = 'text';
		} else if (this.field === 'text') {
			this.field = 'password';
		}
		this.changeDetector.detectChanges();
	}

	public onSubmit(form: FormGroup): void {
		const username = form.value.username;
		let nbErrors = 0;
		if (!username || username.length === 0) {
			this.alert('error', 'Username is required');
			nbErrors++;
		}
		const password = form.value.password;
		if (!password || password.length === 0) {
			this.alert('error', 'Password is required');
			nbErrors++;
		}
		if (nbErrors > 0) {
			return;
		}
		this.auth
			.login(username, password)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (data: unknown) => {
					if (data instanceof HttpResponse) {
						// eslint-disable-next-line @typescript-eslint/naming-convention
						const jwt = (data.body as { access_token: string }).access_token;
						this.storage.saveUser(jwt);
						setTimeout(() => {
							this.alert('success', 'Welcome back!');
							setTimeout(() => {
								this.isLoggedEmitter.emit(true);
							}, 500);
						}, 200);
					}
				},
				error: (error) => {
					setTimeout(() => {
						this.alert('error', error.error.message);
					}, 200);
				},
			});
	}
}

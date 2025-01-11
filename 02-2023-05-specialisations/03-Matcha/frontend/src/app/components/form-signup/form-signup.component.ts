import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AlertService, AuthService } from '@app/shared';
import { InputComponent } from '../input/input.component';
import { HttpResponse } from '@angular/common/http';
import { InputIconComponent } from '../input-icon/input-icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-form-signup',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InputComponent, InputIconComponent],
	templateUrl: './form-signup.component.html',
	styleUrl: './form-signup.component.scss',
})
export class FormSignupComponent implements OnInit {
	public form!: FormGroup;
	public message: string;
	protected field: string = 'password';
	protected fieldConfirm: string = 'password';
	private destroyRef: DestroyRef = inject(DestroyRef);
	@Output() public resultEmitter: EventEmitter<{ result: boolean; message: string }> = new EventEmitter<{
		result: boolean;
		message: string;
	}>();
	public constructor(
		private authService: AuthService,
		private alertService: AlertService,
		private formBuilder: FormBuilder,
		private changeDetector: ChangeDetectorRef,
	) {
		this.message = '';
	}

	public ngOnInit(): void {
		this.message = '';
		this.form = this.formBuilder.group({
			username: [''],
			email: [''],
			newPassword: [''],
			confirmPassword: [''],
			firstName: [''],
			lastName: [''],
			dateOfBirth: [''],
			registration: ['Register'],
		});
	}

	public onRegister(form: FormGroup): void {
		const { username, email, newPassword, confirmPassword, firstName, lastName } = form.value;
		if (newPassword !== confirmPassword) {
			this.message = 'Passwords do not match';
			this.alertService.error(this.message, {
				keepAfterRouteChange: true,
				autoClose: true,
				fade: true,
				open: true,
			});
			this.resultEmitter.emit({ result: false, message: this.message });
			return;
		}
		const sub = this.authService
			.register({ username, email, password: newPassword, firstName, lastName })
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (data) => {
					if (data instanceof HttpResponse) {
						this.message = data.body.message;
						setTimeout(() => {
							this.alertService.success('Successful Registration !', {
								keepAfterRouteChange: true,
								autoClose: true,
								fade: true,
								open: true,
							});
						}, 200);
						this.resultEmitter.emit({ result: true, message: this.message });
					}
				},
				error: (error) => {
					switch (error.error.statusCode) {
						case 400: {
							const messages: string[] = Object.values(error.error.message);
							this.message = Object.values(error.error.message).join('\n');
							messages.forEach((message, index) => {
								setTimeout(() => {
									this.alertService.error(message, {
										keepAfterRouteChange: true,
										autoClose: true,
										fade: true,
										open: true,
									});
								}, index * 200);
							});
							break;
						}
						default: {
							setTimeout(() => {
								this.message = error.error.message;
								this.alertService.error(error.error.message, {
									keepAfterRouteChange: true,
									autoClose: true,
									fade: true,
									open: true,
								});
							}, 200);
							break;
						}
					}

					this.resultEmitter.emit({ result: false, message: this.message });
				},
				complete: () => {
					sub.unsubscribe();
				},
			});
	}

	public onToggleEyeVisibility(): void {
		if (this.field === 'password') {
			this.field = 'text';
		} else if (this.field === 'text') {
			this.field = 'password';
		}
		this.changeDetector.detectChanges();
	}

	public onToggleEyeConfirmVisibility(): void {
		if (this.fieldConfirm === 'password') {
			this.fieldConfirm = 'text';
		} else if (this.fieldConfirm === 'text') {
			this.fieldConfirm = 'password';
		}
		this.changeDetector.detectChanges();
	}
}

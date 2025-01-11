import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderActionComponent, InputComponent, InputIconComponent } from '@app/components';
import { LayoutComponent } from '@app/layout';
import { AlertService, EmailValidationService } from '@app/shared';

@Component({
	selector: 'app-recovery',
	standalone: true,
	imports: [LayoutComponent, HeaderActionComponent, InputComponent, ReactiveFormsModule, InputIconComponent],
	templateUrl: './recovery.component.html',
	styleUrl: './recovery.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryComponent implements OnInit {
	public form: FormGroup;
	public message: string | null;
	private destroyRef: DestroyRef = inject(DestroyRef);
	public constructor(
		private formBuilder: FormBuilder,
		private emailService: EmailValidationService,
		private alertService: AlertService,
	) {
		this.form = this.formBuilder.group({});
		this.message = null;
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			email: [''],
			reset: ['Reset'],
			submit: ['Submit'],
		});
		this.message = null;
	}
	public onSubmit(): void {
		const email = this.form.get('email')?.value ?? '';
		this.emailService
			.recovery(email)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (response) => {
					if (response instanceof HttpResponse) {
						this.message = (response.body as { message: string }).message as string;
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
}

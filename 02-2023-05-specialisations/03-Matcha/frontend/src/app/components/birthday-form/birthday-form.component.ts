import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	EventEmitter,
	inject,
	OnInit,
	Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AlertService, UserService } from '@app/shared';
import { InputComponent } from '../input/input.component';
import { HttpResponse } from '@angular/common/http';
import { InputIconComponent } from '../input-icon/input-icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { formatDate } from '@angular/common';

@Component({
	selector: 'app-birthday-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InputComponent, InputIconComponent],
	templateUrl: './birthday-form.component.html',
	styleUrl: './birthday-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayFormComponent implements OnInit {
	public form: FormGroup;
	@Output() public valid: EventEmitter<boolean> = new EventEmitter<boolean>();
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private userService: UserService,
		private formBuilder: FormBuilder,
		private alertService: AlertService,
		private cdr: ChangeDetectorRef,
	) {
		this.form = this.formBuilder.group({});
	}

	public ngOnInit(): void {
		const now = new Date();
		const eighteenYearsAgo = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
		this.form = this.formBuilder.group({
			birthday: [formatDate(eighteenYearsAgo, 'yyyy-MM-dd', 'en')],
			reset: ['Reset'],
			submit: ['Submit'],
		});
	}

	private update(value: number): void {
		this.userService
			.updateBirthday(value)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (response) => {
					if (response instanceof HttpResponse) {
						this.alert('success', 'Your birthday has been updated successfully.');
						this.valid.emit(true);
						this.cdr.detectChanges();
					}
				},
				error: (error) => {
					setTimeout(() => {
						this.alert('error', error.error.message);
					}, 200);
				},
			});
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		const birthday = this.form.get('birthday')?.value;
		const year = new Date(birthday).getFullYear();
		const now = new Date().getFullYear();
		if (now - year < 18 || !birthday) {
			this.alert('error', 'You must be 18 years old to use this service.');
			this.form.reset({ submit: 'Submit', reset: 'Reset' });
			this.cdr.detectChanges();
			return;
		}
		const timestamp = new Date(birthday).getTime();
		this.update(timestamp);
		this.cdr.detectChanges();
	}

	public onReset(event: Event): void {
		event.preventDefault();
		this.update(0);
		this.form.reset({ submit: 'Submit', reset: 'Reset' });
		this.cdr.detectChanges();
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
}

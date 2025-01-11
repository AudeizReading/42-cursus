import { AlertService, GenderService, UserService } from '@app/shared';
import { Gender, GendersDTO, gendersDTOToGender } from '@app/models';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { CommonModule } from '@angular/common';
import { SelectInputComponent } from '../select-input/select-input.component';
import { InputComponent } from '../input/input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadSpinnerComponent } from '../load-spinner/load-spinner.component';
import { HttpResponse } from '@angular/common/http';

@Component({
	selector: 'app-genders',
	standalone: true,
	imports: [CommonModule, SelectInputComponent, InputComponent, ReactiveFormsModule, LoadSpinnerComponent],
	templateUrl: './genders.component.html',
	styleUrl: './genders.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GendersComponent implements OnInit {
	protected isLoading: boolean = true;
	public genders: Gender[] & string[] = [];
	public form: FormGroup;
	@Output() public valid: EventEmitter<boolean> = new EventEmitter<boolean>();
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private genderService: GenderService,
		private userService: UserService,
		private formBuilder: FormBuilder,
		private alertService: AlertService,
		private cdr: ChangeDetectorRef,
	) {
		this.genders = [];
		this.form = this.formBuilder.group({});
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			gender: [''],
			reset: ['Reset'],
			submit: ['Submit'],
		});
		this.getGenders();
	}

	private getGenders(): void {
		this.genderService
			.getGenders()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (genders) => {
					this.genders = gendersDTOToGender(genders as GendersDTO);
					this.genders.unshift('-- Select Your Gender --');
					this.isLoading = false;
					this.cdr.detectChanges();
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

	public onSubmit(): void {
		const gender = this.form.get('gender')?.value[0] ?? '';
		if (gender.length > 0 && !gender.includes('--')) {
			this.isLoading = true;
			this.cdr.detectChanges();
			this.userService
				.updateGender(gender)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (payload) => {
						if (payload instanceof HttpResponse) {
							this.isLoading = false;
							this.cdr.detectChanges();
							this.valid.emit(true);
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
		} else {
			setTimeout(() => {
				this.alertService.error(`Please select a valid choice. ${gender} is not a valid choice.`, {
					keepAfterRouteChange: true,
					autoClose: true,
					fade: true,
					open: true,
				});
			}, 200);
			this.valid.emit(false);
		}
	}

	public onReset(event: Event): void {
		event.preventDefault();
		this.form.reset({ submit: 'Submit', reset: 'Reset' });
		this.cdr.detectChanges();
	}
}

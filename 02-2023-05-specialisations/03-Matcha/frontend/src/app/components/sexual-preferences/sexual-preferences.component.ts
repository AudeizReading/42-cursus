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
import { SexualPreferencesDTO, sexualPreferencesDTOToGender } from '@app/models';
import { AlertService, SexualPreferenceService, UserService } from '@app/shared';
import { SelectInputComponent } from '../select-input/select-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadSpinnerComponent } from '../load-spinner/load-spinner.component';
import { HttpResponse } from '@angular/common/http';

@Component({
	selector: 'app-sexual-preferences',
	standalone: true,
	imports: [InputComponent, SelectInputComponent, ReactiveFormsModule, LoadSpinnerComponent],
	templateUrl: './sexual-preferences.component.html',
	styleUrl: './sexual-preferences.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SexualPreferencesComponent implements OnInit {
	protected isLoading: boolean = true;
	public sexualPreferenceList: string[];
	public form: FormGroup;
	@Output() public valid: EventEmitter<boolean> = new EventEmitter<boolean>();
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private sexualPreferenceService: SexualPreferenceService,
		private userService: UserService,
		private formBuilder: FormBuilder,
		private alertService: AlertService,
		private cdr: ChangeDetectorRef,
	) {
		this.sexualPreferenceList = [];
		this.form = this.formBuilder.group({});
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			sexualPreference: [''],
			reset: ['Reset'],
			submit: ['Submit'],
		});
		this.getPrefs();
	}

	private getPrefs(): void {
		this.sexualPreferenceService
			.getSexualPreferences()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (sexualPreferences: SexualPreferencesDTO) => {
					this.sexualPreferenceList = sexualPreferencesDTOToGender(sexualPreferences);
					this.sexualPreferenceList.unshift('-- Select Your Sexual Preference --');
					this.isLoading = false;
					this.cdr.detectChanges();
				},
			});
	}

	public onSubmit(form: FormGroup): void {
		const sexualPreference = form.get('sexualPreference')?.value[0] ?? '';
		if (sexualPreference.length > 0 && !sexualPreference.includes('--')) {
			this.isLoading = true;
			this.userService
				.updateSexualPreference(sexualPreference)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (payload) => {
						if (payload instanceof HttpResponse) {
							this.isLoading = false;
							this.valid.emit(true);
							this.cdr.detectChanges();
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
				this.alertService.error(`Please select a valid choice. ${sexualPreference} is not a valid choice.`, {
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

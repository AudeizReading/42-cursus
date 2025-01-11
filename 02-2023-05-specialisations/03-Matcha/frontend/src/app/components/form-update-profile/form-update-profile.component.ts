import {
	Component,
	EventEmitter,
	Output,
	OnInit,
	DestroyRef,
	inject,
	ViewChild,
	ChangeDetectorRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputIconComponent } from '../input-icon/input-icon.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Profile, ProfileSexualityFacade, UpdatePublicProfileAPIQuery } from '@app/models';
import { filter, of, switchMap, tap } from 'rxjs';
import { AlertService, GenderService, ProfileService, SexualPreferenceService, UserService } from '@app/shared';
import { CommonModule, formatDate } from '@angular/common';

@Component({
	selector: 'app-form-update-profile',
	standalone: true,
	imports: [InputIconComponent, TextareaComponent, ReactiveFormsModule, CommonModule],
	templateUrl: './form-update-profile.component.html',
	styleUrl: './form-update-profile.component.scss',
})
export class FormUpdateProfileComponent extends ProfileSexualityFacade implements OnInit {
	public form!: FormGroup;
	protected profile!: Profile;
	@Output() public resultEmitter: EventEmitter<UpdatePublicProfileAPIQuery> =
		new EventEmitter<UpdatePublicProfileAPIQuery>();
	@ViewChild('descriptionTextArea') public descriptionTextArea!: TextareaComponent;

	private destroyRef: DestroyRef = inject(DestroyRef);
	protected disabledSave: boolean = true;

	public constructor(
		private formBuilder: FormBuilder,
		private profileService: ProfileService,
		private changeDetector: ChangeDetectorRef,
		alertService: AlertService,
		genderService: GenderService,
		sexualPreferenceService: SexualPreferenceService,
		userService: UserService,
	) {
		super(alertService, genderService, sexualPreferenceService, userService);
		this.form = this.formBuilder.group({
			username: [],
			firstname: [],
			lastname: [],
			birthday: [],
			description: [],
			gender: [],
			sexualPreference: [],
		});
	}

	public ngOnInit(): void {
		this.profileService.profile$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				tap((payload) => (this.profile = new Profile(payload))),
				switchMap(() => this.setGendersList()),
				switchMap(() => this.setSexualitiesList()),
			)
			.subscribe({
				next: () => {
					this.buildform();

					this.monitorValueChanges();
					this.monitorStatusChanges();
				},
			});
	}

	private buildform(): void {
		this.form = this.formBuilder.group({
			username: [this.profile.username!],
			firstname: [this.profile.firstName!],
			lastname: [this.profile.lastName!],
			birthday: [formatDate(this.profile.birthday!, 'yyyy-MM-dd', 'en')],
			description: [this.profile.description!],
			gender: [this.profile.gender!],
			sexualPreference: [this.profile.sexualPreference!],
		});
		this.changeDetector.detectChanges();
	}

	private monitorValueChanges(): void {
		this.form.valueChanges
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				filter((value) => {
					return (
						value.username !== this.profile.username! ||
						value.firstname !== this.profile.firstName! ||
						value.lastname !== this.profile.lastName! ||
						value.birthday !== this.profile.birthday! ||
						value.description !== this.profile.description! ||
						value.gender !== this.profile.gender! ||
						value.sexualPreference !== this.profile.sexualPreference!
					);
				}),
				switchMap((value) =>
					// vu que la sexuality depend du gender,
					// gender est le seul input du form a etre update directement au changement
					// ca permet de mettre a jour la liste des sexualities en fonction du gender
					value.gender !== this.profile.gender
						? this.updateGender(value.gender).pipe(
								takeUntilDestroyed(this.destroyRef),
								switchMap((value) => {
									this.profile.gender = (value as { gender: string }).gender;
									return this.setSexualitiesList();
								}),
							)
						: of(value),
				),
			)
			.subscribe(() => {
				this.disabledSave = false;
				this.changeDetector.detectChanges();
			});
	}

	private monitorStatusChanges(): void {
		this.form.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
			if (value !== 'VALID') {
				this.disabledSave = true;
				this.changeDetector.detectChanges();
			}
		});
	}

	private union(changed: UpdatePublicProfileAPIQuery): UpdatePublicProfileAPIQuery {
		const changedProperties: UpdatePublicProfileAPIQuery = {};

		// Compare chaque propriété du nouveau profil avec l'ancien
		if (this.profile.username !== changed.username) {
			changedProperties.username = changed.username;
		}
		if (this.profile.firstName !== changed.firstname) {
			changedProperties.firstname = changed.firstname;
		}
		if (this.profile.lastName !== changed.lastname) {
			changedProperties.lastname = changed.lastname;
		}
		if (this.profile.birthday !== changed.birthday) {
			changedProperties.birthday = changed.birthday;
		}
		if (this.profile.description !== changed.description) {
			changedProperties.description = changed.description;
		}
		if (this.profile.sexualPreference !== changed.sexualPreference) {
			// vu que la sexuality depend du gender,
			// gender est le seul input du form a etre update directement au changement
			// ca permet de mettre a jour la liste des sexualities en fonction du gender
			changedProperties.gender = changed.gender;
			changedProperties.sexualPreference = changed.sexualPreference;
		}

		return changedProperties;
	}

	private updatePublicProfile(): UpdatePublicProfileAPIQuery {
		const changes = Object.entries(this.union(this.form.getRawValue()));
		const newUpdate: UpdatePublicProfileAPIQuery = {};
		for (const [key, value] of changes) {
			if (Object.hasOwn(this.profile, key)) {
				if (key === 'birthday') {
					const timestamp = new Date(value as string | number).getTime();
					this.profile.birthday = timestamp.toString();
					newUpdate.birthday = timestamp;
					Object.assign(this.profile, { birthday: timestamp });
					Object.assign(newUpdate, { [key]: timestamp });
				} else {
					Object.assign(newUpdate, { [key]: value });
					Object.assign(this.profile, { [key]: value });
				}
			} else {
				if (key === 'firstname') {
					Object.assign(newUpdate, { firstname: value });
					Object.assign(this.profile, { firstName: value });
				} else if (key === 'lastname') {
					Object.assign(newUpdate, { lastname: value });
					Object.assign(this.profile, { lastName: value });
				}
			}
		}
		this.changeDetector.detectChanges();
		return newUpdate;
	}

	public onSubmit(): void {
		this.disabledSave = true;

		this.resultEmitter.emit(this.updatePublicProfile());
	}
}

import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	EventEmitter,
	inject,
	Output,
	OnInit,
} from '@angular/core';
import { InputIconComponent } from '../input-icon/input-icon.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Profile, UpdatePrivateProfileAPIQuery } from '@app/models';
import { ProfileService } from '@app/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-form-update-private',
	standalone: true,
	imports: [InputIconComponent, ReactiveFormsModule],
	templateUrl: './form-update-private.component.html',
	styleUrl: './form-update-private.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUpdatePrivateComponent implements OnInit {
	public privateForm!: FormGroup;
	private passwdPlaceholder: string = '************';
	protected field: string = 'password';
	protected profile!: Profile;
	@Output() public resultEmitter: EventEmitter<UpdatePrivateProfileAPIQuery> =
		new EventEmitter<UpdatePrivateProfileAPIQuery>();

	private destroyRef: DestroyRef = inject(DestroyRef);
	protected disabledSave: boolean = true;

	public constructor(
		private formBuilder: FormBuilder,
		private profileService: ProfileService,
		private changeDetector: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		const sub = this.profileService.profile$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: (profile) => {
				this.profile = new Profile(profile);

				this.privateForm = this.formBuilder.group({
					email: [this.profile.email!],
					password: [this.passwdPlaceholder],
				});
				this.changeDetector.detectChanges();

				this.privateForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
					if (value.email !== this.profile.email!) {
						this.disabledSave = false;
						this.changeDetector.detectChanges();
					}
					if (value.password !== this.passwdPlaceholder || value.password.match(/^\*{0,100}$/)) {
						this.disabledSave = false;
						this.changeDetector.detectChanges();
					}
				});

				this.privateForm.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
					if (value !== 'VALID') {
						this.disabledSave = true;
						this.changeDetector.detectChanges();
					}
				});
			},
			complete: () => {
				sub.unsubscribe();
			},
		});
	}

	private union(changed: UpdatePrivateProfileAPIQuery): UpdatePrivateProfileAPIQuery {
		const changedProperties: UpdatePrivateProfileAPIQuery = {};

		// Compare chaque propriété du nouveau profil avec l'ancien
		if (this.profile.email !== changed.email) {
			changedProperties.email = changed.email;
		}
		if (changed.password && !changed.password.match(/^\*{0,100}$/) && changed.password !== this.passwdPlaceholder) {
			changedProperties.password = changed.password;
		}

		return changedProperties;
	}

	public onToggleEyeVisibility(): void {
		if (this.field === 'password') {
			if (this.privateForm.get('password')?.value === this.passwdPlaceholder) {
				this.privateForm.get('password')?.setValue('');
			}
			this.field = 'text';
		} else if (this.field === 'text') {
			this.field = 'password';
		}
		this.changeDetector.detectChanges();
	}

	public onSubmit(): void {
		this.disabledSave = true;
		this.changeDetector.detectChanges();
		const changes = Object.entries(this.union(this.privateForm.getRawValue()));
		const newUpdate: UpdatePrivateProfileAPIQuery = {};
		for (const [key, value] of changes) {
			if (Object.hasOwn(this.profile, key)) {
				Object.assign(this.profile, { [key]: value });
			}
			Object.assign(newUpdate, { [key]: value });
		}
		this.resultEmitter.emit(newUpdate);
	}
}

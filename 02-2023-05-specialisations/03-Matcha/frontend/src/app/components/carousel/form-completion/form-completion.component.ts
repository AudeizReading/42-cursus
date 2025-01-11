import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	EventEmitter,
	inject,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { GendersComponent } from '@app/components/genders/genders.component';
import { SexualPreferencesComponent } from '@app/components/sexual-preferences/sexual-preferences.component';
import { DescriptionProfileComponent } from '@app/components/description-profile/description-profile.component';
import { FileUploadComponent } from '@app/components/file-upload/file-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileDTO } from '@app/models';
import { BirthdayFormComponent } from '@app/components/birthday-form/birthday-form.component';
import { TagsFormComponent } from '@app/components/tags-form/tags-form.component';
import { LocationFormComponent } from '@app/components/location-form/location-form.component';
import { ProfileService } from '@app/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface FormItem {
	name: string;
	component: string;
}

@Component({
	selector: 'app-form-completion',
	standalone: true,
	templateUrl: './form-completion.component.html',
	styleUrl: './form-completion.component.scss',
	imports: [
		GendersComponent,
		SexualPreferencesComponent,
		DescriptionProfileComponent,
		FileUploadComponent,
		BirthdayFormComponent,
		TagsFormComponent,
		ReactiveFormsModule,
		LocationFormComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCompletionComponent implements OnInit, OnChanges {
	// FormCompletionComponent properties
	public items: FormItem[];
	public currentIndex: number;
	public order: number[];

	@Output() public valid: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public needCheckProfile: EventEmitter<boolean> = new EventEmitter<boolean>();
	private destroyRef: DestroyRef = inject(DestroyRef);
	public profile!: ProfileDTO;
	public nbPics: number = 5;

	public constructor(
		private profileService: ProfileService,
		private cdr: ChangeDetectorRef,
	) {
		this.items = [
			{ name: 'gender', component: 'app-genders' },
			{ name: 'description', component: 'app-description-profile' },
			{ name: 'sexualPreference', component: 'app-sexual-preferences' },
			{ name: 'defaultPicture', component: 'app-file-upload ' },
			{ name: 'birthday', component: 'app-birthday-form' },
			{ name: 'tags', component: 'app-tags-form' },
			{ name: 'locations', component: 'app-location-form' },
		];
		this.currentIndex = 0;
		this.order = this.items.map((_, idx) => idx);
	}

	public ngOnInit(): void {
		this.profileService.profile$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((profile) => {
			this.profile = profile;
			this.computeOrdering();
			this.currentIndex = this.order.length > 0 ? this.order[0] : 0;
			this.nbPics = 5 - profile?.pictures?.length;
			this.cdr.detectChanges();
		});

		this.profileService.profileCompleted$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((completed) => {
			if (completed) {
				if (this.order.length == 0) this.valid.emit(true);
				this.cdr.detectChanges();
			}
		});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if ('profile' in changes && changes['profile'].currentValue !== changes['profile'].previousValue) {
			this.profile = changes['profile'].currentValue;
			this.computeOrdering();
			this.currentIndex = this.order.length > 0 ? this.order[0] : 0;
			this.cdr.detectChanges();
		}
	}

	private computeOrdering(): void {
		this.items.forEach((item, idx) => {
			if (Object.prototype.hasOwnProperty.call(this.profile, item.name) !== undefined) {
				const prop = Object.entries(this.profile).find(([key]) => key === item.name)?.[1];
				if (
					((Array.isArray(prop) || typeof prop === 'string') && prop.length > 0) ||
					(prop?.name && prop?.name.length > 0) ||
					prop?.fake?.id ||
					prop?.navigator?.id
				) {
					this.order = this.order.filter((order) => order !== idx);
				}
			}
		});
	}

	public advanceToNextItem(): void {
		if (this.order.length > 0) this.order.shift();
		if (this.order.length > 0) {
			this.currentIndex = this.order[0];
		} else {
			this.profileService
				.isAPIComplete()
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (complete) => {
						this.profileService.emitProfileCompleted(complete);
					},
				});
		}
		this.cdr.detectChanges();
	}

	public onComponentValidated(valid: boolean): void {
		if (valid) {
			this.advanceToNextItem();
		}
	}

	public getCurrentItem(index: number): string {
		const comp = this.items[index].component;
		return `<${comp} (valid)="onComponentValidated($event)"></${comp}>`;
	}
}

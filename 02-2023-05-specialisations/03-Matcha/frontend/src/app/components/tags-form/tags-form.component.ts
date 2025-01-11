import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	EventEmitter,
	inject,
	Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AlertService, ProfileService } from '@app/shared';
import { InputComponent } from '../input/input.component';
import { TagUpdateComponent } from '../tag-update/tag-update.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-tags-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InputComponent, TagUpdateComponent],
	templateUrl: './tags-form.component.html',
	styleUrl: './tags-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsFormComponent {
	public form: FormGroup;
	private destroyRef: DestroyRef = inject(DestroyRef);

	@Output() public valid: EventEmitter<boolean> = new EventEmitter<boolean>();
	public constructor(
		private formBuilder: FormBuilder,
		private alertService: AlertService,
		private profileService: ProfileService,
		private cdr: ChangeDetectorRef,
	) {
		this.form = this.formBuilder.group({
			submit: ['Submit'],
		});
	}

	public onSubmit(): void {
		this.profileService
			.getProfile()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (profile) => {
					if (profile.tags && profile.tags.length) {
						this.valid.emit(true);
						this.cdr.detectChanges();
					} else {
						this.alert('error', 'Please add at least one tag');
					}
				},
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
}

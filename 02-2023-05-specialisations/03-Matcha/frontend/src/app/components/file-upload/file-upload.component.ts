import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	EventEmitter,
	inject,
	Output,
	ViewChild,
} from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AlertService, UserService } from '@app/shared';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpdatePicturesComponent } from '..';

@Component({
	selector: 'app-file-upload',
	standalone: true,
	imports: [InputComponent, ReactiveFormsModule, CommonModule, UpdatePicturesComponent],
	templateUrl: './file-upload.component.html',
	styleUrl: './file-upload.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
	public form: FormGroup;
	private destroyRef: DestroyRef = inject(DestroyRef);

	@Output() public valid: EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild(UpdatePicturesComponent)
	public updatePicturesComponent!: UpdatePicturesComponent;

	public constructor(
		private userService: UserService,
		private formBuilder: FormBuilder,
		private alertService: AlertService,
		private cdr: ChangeDetectorRef,
	) {
		this.form = this.formBuilder.group({
			submit: ['Submit'],
			reset: ['Reset'],
		});
	}

	public onSubmit(): void {
		if (this.updatePicturesComponent.main.id) {
			this.setAsProfilePicture(this.updatePicturesComponent.main.id);
			this.cdr.detectChanges();
			this.valid.emit(true);
			return;
		} else if (this.updatePicturesComponent.aux.filter((aux) => aux.name !== 'placeholder').length > 0) {
			const firstAux = this.updatePicturesComponent.aux.filter((aux) => aux.name !== 'placeholder')[0];
			if (firstAux && firstAux.id) {
				this.setAsProfilePicture(firstAux.id);
				this.cdr.detectChanges();
				this.valid.emit(true);
				return;
			}
		}
		this.noFileSelected();
		return;
	}

	private setAsProfilePicture(id: number): void {
		this.userService
			.updateDefaultPicture(String(id))
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (response) => {
					if (response instanceof HttpResponse) {
						this.alert('success', 'File defined as profile picture');
						this.cdr.detectChanges();
					}
				},
				error: (error) => {
					this.alert('error', error.error.message);
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

	private noFileSelected(): void {
		this.alert('error', 'You must select a file');
	}
}

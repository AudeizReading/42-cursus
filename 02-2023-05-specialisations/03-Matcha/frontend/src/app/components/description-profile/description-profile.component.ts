import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	EventEmitter,
	inject,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { TextareaComponent } from '../textarea/textarea.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { AlertService, UserService } from '@app/shared';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-description-profile',
	standalone: true,
	imports: [TextareaComponent, InputComponent, ReactiveFormsModule],
	templateUrl: './description-profile.component.html',
	styleUrl: './description-profile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionProfileComponent implements OnInit {
	public form: FormGroup;
	@Output() public valid: EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild('descriptionTextArea') public descriptionTextArea!: TextareaComponent;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private userService: UserService,
		private formBuilder: FormBuilder,
		private alertService: AlertService,
	) {
		this.form = this.formBuilder.group({});
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			description: [''],
			reset: ['Reset'],
			submit: ['Submit'],
		});
	}

	public onSubmit(form: FormGroup): void {
		const description = form.get('description')?.value ?? '';
		if (description.length > 0) {
			const sub = this.userService
				.updateDescription(description)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (resp) => {
						if (resp instanceof HttpResponse) {
							this.valid.emit(true);
							sub.unsubscribe();
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
				this.alertService.error('You should enter a minimal description !', {
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
	}
}

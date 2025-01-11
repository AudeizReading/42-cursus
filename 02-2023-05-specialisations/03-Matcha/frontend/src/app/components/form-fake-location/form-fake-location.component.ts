import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	Input,
	OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from '../map/map.component';
import { LeafletCoordinatesDTO } from '@app/models';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService, LocationService, UserService } from '@app/shared';
import { InputComponent } from '../input/input.component';
import { HttpResponse } from '@angular/common/http';
import { catchError, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-form-fake-location',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MapComponent, InputComponent],
	templateUrl: './form-fake-location.component.html',
	styleUrl: './form-fake-location.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFakeLocationComponent implements OnInit {
	@Input() public coords: LeafletCoordinatesDTO = {
		latitude: 43.71,
		longitude: 7.28,
		zoom: 1,
		type: 'FAKE',
	};
	@Input() public usecase: 'event' | 'update' = 'update';
	public form: FormGroup;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private ref: DynamicDialogRef,
		private config: DynamicDialogConfig,
		private alertService: AlertService,
		private locationService: LocationService,
		private userService: UserService,
		private formBuilder: FormBuilder,
		private changeDetector: ChangeDetectorRef,
	) {
		this.form = this.formBuilder.group({});
		if (this.config.data.coords) {
			this.coords = { ...config.data.coords };
		}
		if (this.config.data.usecase) {
			this.usecase = config.data.usecase;
		}
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			submit: ['Save'],
		});
	}

	public onSubmit(): void {
		if (this.usecase === 'update') {
			switch (this.coords.type) {
				case 'FAKE': {
					this.userService
						.updateLocationType('FAKE')
						.pipe(
							takeUntilDestroyed(this.destroyRef),
							switchMap(() => {
								return this.locationService.updateFakeLocation(
									this.coords.latitude,
									this.coords.longitude,
								);
							}),
							catchError((error) => {
								this.alert('error', error.message);
								this.ref.close({ status: 'failure', message: error.message });
								return of(null);
							}),
						)
						.subscribe({
							next: (response) => {
								if (response instanceof HttpResponse) {
									this.alert('success', 'Location on Map updated successfully');
									this.ref.close({
										latitude: this.coords.latitude,
										longitude: this.coords.longitude,
										type: this.coords.type,
										zoom: this.coords.zoom,
									});
								}
							},
							complete: () => {
								this.ref.close({
									status: 'complete',
									payload: this.coords,
								});
							},
						});
					break;
				}
			}
		} else if (this.usecase === 'event') {
			this.ref.close({
				status: 'complete',
				payload: this.coords,
			});
		}
	}

	public updateCoordinates(event: { latitude: number; longitude: number }): void {
		this.coords.latitude = event.latitude;
		this.coords.longitude = event.longitude;
		this.changeDetector.detectChanges();
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

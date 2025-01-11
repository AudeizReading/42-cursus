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
import { InputComponent } from '../input/input.component';
import { AlertService, GeolocationService, LocationService, UserService } from '@app/shared';
import { MapComponent } from '../map/map.component';
import { HttpResponse } from '@angular/common/http';
import { filter, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertFacade } from '@app/models';

@Component({
	selector: 'app-location-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InputComponent, MapComponent],
	templateUrl: './location-form.component.html',
	styleUrl: './location-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationFormComponent extends AlertFacade implements OnInit {
	public form: FormGroup;
	public latitude: number;
	public longitude: number;
	public zoom: number;
	protected type: string;
	@Output() public valid: EventEmitter<boolean> = new EventEmitter<boolean>();
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private formBuilder: FormBuilder,
		private geolocationService: GeolocationService,
		private locationService: LocationService,
		private userService: UserService,
		private cdr: ChangeDetectorRef,
		alertService: AlertService,
	) {
		super(alertService);
		this.form = this.formBuilder.group({});
		this.latitude = 43.71;
		this.longitude = 7.28;
		this.zoom = 10;
		this.type = 'IP';

		this.checkGeoPermission();
	}

	protected checkGeoPermission(): void {
		this.geolocationService.geoPermission
			.then((perm) => {
				if (perm.state === 'denied') {
					this.geolocationService.stopTracking();
					this.type = 'FAKE';
				} else if (perm.state === 'prompt' || perm.state === 'granted') {
					this.geolocationService.startTracking();
					this.type = 'NAVIGATOR';
				}
				this.cdr.markForCheck();
			})
			.catch((error) => {
				throw error;
			});
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			reset: ['Reset'],
			submit: ['Submit'],
		});

		this.geolocationService.position$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: (response) => {
				if (response !== null) {
					this.valid.emit(true);
					this.cdr.detectChanges();
					this.alert('success', 'Location By GPS updated successfully');
				}
			},
			error: () => {
				this.type = 'FAKE';
			},
		});
	}

	public updateCoordinates(event: { latitude: number; longitude: number }): void {
		this.latitude = event.latitude > 0 ? event.latitude : this.latitude;
		this.longitude = event.longitude > 0 ? event.longitude : this.longitude;
		this.type = 'FAKE';
		this.cdr.detectChanges();
	}

	public onReset(event: Event): void {
		event.preventDefault();
		this.form.reset({ submit: 'Submit', reset: 'Reset' });
		this.type = 'IP';
		this.cdr.detectChanges();
	}

	public onSubmit(): void {
		this.geolocationService.geoPermission
			.then((perm) => {
				switch (perm.state) {
					case 'granted': {
						this.userService
							.updateLocationType('NAVIGATOR')
							.pipe(
								takeUntilDestroyed(this.destroyRef),
								filter((response) => response instanceof HttpResponse),
								switchMap((response) => {
									if (response instanceof HttpResponse) {
										return this.locationService.updateNavigatorLocation(
											this.latitude,
											this.longitude,
										);
									} else {
										return of(null);
									}
								}),
							)
							.subscribe({
								next: (response) => {
									if (response instanceof HttpResponse) {
										this.alert('success', 'Location updated successfully');
										this.valid.emit(true);
										this.cdr.detectChanges();
									}
								},
							});
						break;
					}
					case 'denied': {
						this.geolocationService.stopTracking();
						this.userService
							.updateLocationType('FAKE')
							.pipe(
								takeUntilDestroyed(this.destroyRef),
								filter((response) => response instanceof HttpResponse),
								switchMap((response) => {
									if (response instanceof HttpResponse) {
										return this.locationService.updateFakeLocation(this.latitude, this.longitude);
									} else {
										return of(null);
									}
								}),
							)
							.subscribe({
								next: (response) => {
									if (response instanceof HttpResponse) {
										this.alert('success', 'Location updated successfully');
										this.valid.emit(true);
										this.cdr.detectChanges();
									}
								},
							});
						break;
					}
					case 'prompt':
						this.alert('error', 'Please allow geolocation or select a location on the map');
						this.geolocationService.startTracking();
						break;
				}
				this.cdr.markForCheck();
			})
			.catch((error) => {
				throw error;
			});
	}
}

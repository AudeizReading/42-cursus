import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	EventEmitter,
	inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
	AlertFacade,
	CoordinatesDTO,
	LeafletCoordinatesDTO,
	LocationAddressDTO,
	LocationType,
	LocationUpdateDTO,
	createLocationDTO,
} from '@app/models';
import { AlertService, GeolocationService, LocationService, UserService } from '@app/shared';
import { FakeLocationDialogComponent } from '../../../overlay/fake-location-dialog/fake-location-dialog.component';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-location',
	standalone: true,
	imports: [FormsModule, FakeLocationDialogComponent, CommonModule, ReactiveFormsModule],
	templateUrl: './location.component.html',
	styleUrl: './location.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationComponent extends AlertFacade implements OnInit, OnChanges, OnDestroy {
	@Input({ required: true }) public coords!: CoordinatesDTO;
	@Input({ required: true }) public userId!: number;
	@Input({ required: true }) public type!: LocationType;
	@Output() public updateLocation: EventEmitter<LocationUpdateDTO> = new EventEmitter<LocationUpdateDTO>();

	protected settings!: LocationUpdateDTO;
	protected canAskGPS: boolean = true;

	protected form: FormGroup = this.fb.group({
		location: ['', [Validators.required]],
	});
	private subscriptionsGPS = new Subscription();
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		alertService: AlertService,
		private locationService: LocationService,
		private geolocationService: GeolocationService,
		private userService: UserService,
		private cdr: ChangeDetectorRef,
		private fb: FormBuilder,
	) {
		super(alertService);
	}

	public ngOnDestroy(): void {
		this.subscriptionsGPS.unsubscribe();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (
			changes['coords'] &&
			(changes['coords'].currentValue?.longitude !== changes['coords'].previousValue?.longitude ||
				changes['coords'].currentValue?.latitude !== changes['coords'].previousValue?.latitude)
		) {
			this.coords = { ...changes['coords'].currentValue };
		}
		if (changes['userId'] && changes['userId'].currentValue !== changes['userId'].previousValue) {
			this.userId = changes['userId'].currentValue;
		}
		if (changes['type'] && changes['type'].currentValue !== changes['type'].previousValue) {
			this.type = changes['type'].currentValue;
		}
		if (
			(changes['coords'] &&
				(changes['coords'].currentValue?.longitude !== changes['coords'].previousValue?.longitude ||
					changes['coords'].currentValue?.latitude !== changes['coords'].previousValue?.latitude)) ||
			(changes['userId'] && changes['userId'].currentValue !== changes['userId'].previousValue) ||
			(changes['type'] && changes['type'].currentValue !== changes['type'].previousValue)
		) {
			if (this.settings) {
				this.getCityDatas();
			}
		}
	}

	public ngOnInit(): void {
		if (!this.coords || !this.userId) {
			throw new Error('Access impossible to this setting.');
		}
		this.settings = new LocationUpdateDTO({
			city: '',
			state: '',
			countryName: '',
			...createLocationDTO({ ...this.coords, userId: this.userId, type: this.type }),
		});

		this.form = this.fb.group({
			location: [this.type.toLocaleLowerCase(), [Validators.required]],
		});

		if (this.type === 'FAKE') {
			this.settings.openFake = false;
			this.settings.update = { ...this.fakeCoords };
		} else if (this.type === 'NAVIGATOR') {
			this.geolocationService.geoPermission.then((permission) => {
				if (permission.state !== 'granted') {
					this.form.get('location')?.setValue('ip');
					this.canAskGPS = true;
					this.cdr.detectChanges();
				}
			});
		}

		this.geolocationService.position$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: (response) => {
				if (response !== null) {
					this.getCityDatas();
					this.settings.update = {
						latitude: response.coords.latitude,
						longitude: response.coords.longitude,
					};
					this.canAskGPS = false;
					this.locationType = { value: 'NAVIGATOR' };
					this.settings.openFake = false;
					this.cdr.detectChanges();
				}
			},
			error: () => {
				const locationType = this.form.get('location')?.value;
				if (locationType === 'navigator') {
					this.locationType = { value: 'IP' };
				}
				this.getCityDatas();
				this.canAskGPS = true;
				this.cdr.detectChanges();
			},
		});

		this.getCityDatas();
		this.cdr.detectChanges();

		this.form.valueChanges.subscribe((value) => {
			switch (value.location) {
				case 'ip':
					this.settings.openFake = false;
					this.onIpUpdate();
					break;
				case 'fake':
					this.settings.openFake = true;
					break;
				case 'navigator':
					this.settings.openFake = false;
					this.canAskGPS = false;
					this.locationType = { value: 'NAVIGATOR' };
					this.geolocationService.startTracking();

					break;
			}
			this.cdr.detectChanges();
			this.getCityDatas();
		});
	}

	protected get location(): string {
		return this.form.get('location')?.value;
	}

	private getCityDatas(): void {
		this.locationService
			.getLocation(this.settings.latitude, this.settings.longitude)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (response) => {
					const location = response as LocationAddressDTO;
					const address = location.address;

					this.settings.context = {
						city: address.city,
						state: address.state,
						countryName: address.countryName,
					};
					this.cdr.detectChanges();
				},
				error: (error) => {
					this.alert('error', error.message);
				},
			});
	}

	protected get fakeCoords(): LeafletCoordinatesDTO {
		return {
			...this.settings.coordsLeaflet,
			type: 'FAKE',
		};
	}

	public onFakeUpdate(event: LeafletCoordinatesDTO): void {
		if (event.latitude && event.latitude !== -1 && event.longitude && event.longitude !== -1) {
			this.locationType = { value: 'FAKE', coords: event };
		} else {
			this.form.get('location')?.setValue(this.type.toLocaleLowerCase(), { emitEvent: false });
		}
	}

	protected checkGeoPermission(): void {
		console.trace('checkGeoPermission');
		this.geolocationService.geoPermission
			.then((perm) => {
				if (perm.state === 'denied') {
					this.geolocationService.stopTracking();
				} else if (perm.state === 'prompt' || perm.state === 'granted') {
					this.geolocationService.startTracking();
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	protected onGPSUpdate(): void {
		this.settings.openFake = false;
		this.checkGeoPermission();
	}

	protected onIpUpdate(): void {
		this.settings.openFake = false;
		this.locationService
			.updateIpTypeLocation()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload) => {
					if (payload instanceof HttpResponse) {
						this.locationType = { value: 'IP' };
						this.alert('success', `Location by IP updated successfully`);
					}
				},
				error: (error) => {
					this.alert('error', error.message);
				},
			});
	}

	private set locationType(datas: { value: LocationType; coords?: LeafletCoordinatesDTO }) {
		const { value, coords } = datas;
		this.type = value;
		this.settings.update = { ...coords, type: value };

		this.form.get('location')?.setValue(value.toLocaleLowerCase(), {
			emitEvent: this.form.get('location')?.value === value.toLocaleLowerCase() ? false : true,
		});
		this.updateLocation.emit(this.settings);
		this.cdr.detectChanges();
	}
}

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CoordinatesDTO, HereAddressDTO, LocationAddressDTO } from '@app/models';
import { AlertService, LocationService } from '@app/shared';

@Component({
	selector: 'app-city',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './city.component.html',
	styleUrl: './city.component.scss',
})
export class CityComponent implements OnInit, OnChanges {
	@Input() public coords!: CoordinatesDTO;
	private destroyRef: DestroyRef = inject(DestroyRef);
	public context: string;

	public constructor(
		private alertService: AlertService,
		private locationService: LocationService,
	) {
		this.context = '';
	}

	public ngOnInit(): void {
		this.context = '';
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (
			'coords' in changes &&
			changes['coords'].currentValue?.longitude !== changes['coords'].previousValue?.longitude &&
			changes['coords'].currentValue?.latitude !== changes['coords'].previousValue?.latitude
		) {
			this.coords = { ...changes['coords'].currentValue };
			this.getDatas();
		}
	}

	private getDatas(): void {
		if (!this.coords) {
			this.context = '';
		} else {
			const sub = this.locationService
				.getLocation(this.coords.latitude, this.coords.longitude)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (response) => {
						const location = response as LocationAddressDTO;
						const address = new HereAddressDTO(location.address);
						this.context = address.toString();
						sub.unsubscribe();
					},
					error: this.error.bind(this),
				});
		}
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

	private error(error: { error: { message: string } }): void {
		this.alert('error', error.error.message);
	}
}

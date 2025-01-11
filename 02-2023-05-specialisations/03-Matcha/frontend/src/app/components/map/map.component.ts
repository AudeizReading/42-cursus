import {
	AfterViewInit,
	Component,
	DestroyRef,
	EventEmitter,
	inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertFacade } from '@app/models';
import { AlertService } from '@app/shared';
import { MapService } from '@app/shared/services/map/map.service';

@Component({
	selector: 'app-map',
	standalone: true,
	imports: [],
	templateUrl: './map.component.html',
	styleUrl: './map.component.scss',
})
export class MapComponent extends AlertFacade implements OnChanges, AfterViewInit {
	@Input() public latitude!: number;
	@Input() public longitude!: number;
	@Input() public zoom!: number;
	@Output() public moving: EventEmitter<{ latitude: number; longitude: number }> = new EventEmitter<{
		latitude: number;
		longitude: number;
	}>();
	private map!: L.Map;
	private marker!: L.Marker;
	private tiles!: L.TileLayer;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private mapService: MapService,
		alertService: AlertService,
	) {
		super(alertService);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['latitude'] && changes['latitude'].currentValue !== changes['latitude'].previousValue) {
			this.latitude = changes['latitude'].currentValue;
		}
		if (changes['longitude'] && changes['longitude'].currentValue !== changes['longitude'].previousValue) {
			this.longitude = changes['longitude'].currentValue;
		}
		if (this.map && this.marker) {
			this.map.setView([this.latitude, this.longitude], this.zoom);
			this.addMarker(this.latitude, this.longitude);
			this.addTiles();
		}
	}

	public ngAfterViewInit(): void {
		this.initMap();
	}

	private initMap(): void {
		this.mapService
			.getMap()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (leaflet) => {
					this.map = leaflet.map('map').setView([this.latitude, this.longitude], this.zoom);
					this.tiles = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						maxZoom: 20,
						minZoom: 0,
						attribution:
							// eslint-disable-next-line max-len
							'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					});
					this.tiles.addTo(this.map);
					const myIcon = leaflet.icon({
						iconUrl: './assets/img/map-pin.png',
						iconSize: [36, 36],
					});
					this.marker = leaflet.marker([this.latitude, this.longitude], { icon: myIcon });
					this.marker.addTo(this.map);
					this.map.on('click', (e) => {
						if (e.latlng.lat && e.latlng.lng) {
							const x = e.latlng.lat;
							const y = e.latlng.lng;
							this.addMarker(x, y);
							this.moving.emit({ latitude: x, longitude: y });
						}
					});
					this.map.on('zoom', (e) => {
						this.zoom = e.target.getZoom();
					});
				},
			});
	}

	private addMarker(latitude: number, longitude: number): void {
		this.marker.setLatLng([latitude, longitude]);
	}

	private addTiles(): void {
		this.tiles.remove();
		this.mapService
			.getMap()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (leaflet) => {
					this.tiles = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						maxZoom: 20,
						minZoom: 0,
						attribution:
							'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					});
					this.tiles.addTo(this.map);
				},
				error: (err) => {
					this.alert('error', `Error creating map: ${err.message}`);
				},
			});
	}
}

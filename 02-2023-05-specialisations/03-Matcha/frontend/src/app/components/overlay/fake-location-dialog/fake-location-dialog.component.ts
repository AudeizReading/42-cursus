import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { FormFakeLocationComponent } from '@app/components/form-fake-location/form-fake-location.component';
import { LeafletCoordinatesDTO } from '@app/models';
import { AlertService } from '@app/shared';

@Component({
	selector: 'app-fake-location-dialog',
	standalone: true,
	imports: [DynamicDialogModule, InputSwitchModule, FormsModule],
	providers: [DialogService],
	templateUrl: './fake-location-dialog.component.html',
	styleUrl: './fake-location-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FakeLocationDialogComponent implements OnChanges {
	@Input() public coords: LeafletCoordinatesDTO = {
		latitude: 43.71,
		longitude: 7.28,
		zoom: 1,
		type: 'FAKE',
	};
	@Input() public open: boolean = false;
	@Input() public usecase: 'event' | 'update' = 'update';
	@Output() public closed: EventEmitter<LeafletCoordinatesDTO> = new EventEmitter<LeafletCoordinatesDTO>();

	public ref!: DynamicDialogRef;
	public constructor(
		private readonly dialogService: DialogService,
		private changeDetector: ChangeDetectorRef,
		private alertService: AlertService,
	) {}
	public ngOnChanges(changes: SimpleChanges): void {
		if (
			changes['open'] &&
			changes['open'].currentValue &&
			changes['open'].currentValue !== changes['open'].previousValue &&
			changes['open'].currentValue === true
		) {
			this.show();
		}
	}

	public show(): void {
		this.changeDetector.detectChanges();
		if (!this.coords) {
			this.alert('error', 'No coordinates available');
			return;
		}
		this.open = true;
		this.ref = this.dialogService.open(FormFakeLocationComponent, {
			header: '',
			width: '100%',
			modal: true,
			data: { coords: this.coords, usecase: this.usecase },
			contentStyle: { 'max-height': '75vh', overflow: 'auto' },
			baseZIndex: 10000,
			maximizable: true,
		});

		this.ref.onClose.subscribe((payload: { payload: LeafletCoordinatesDTO }) => {
			if (payload && payload.payload) {
				this.closed.emit(payload.payload);
			} else {
				this.closed.emit({ ...this.coords, latitude: -1, longitude: -1 });
			}
			this.open = false;
			this.changeDetector.detectChanges();
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

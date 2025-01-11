import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { IconComponent } from '@app/components/icon/icon.component';

@Component({
	selector: 'app-button-notification',
	standalone: true,
	imports: [IconComponent],
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonNotificationComponent implements OnInit, OnChanges {
	@Input() public nbOfNotification!: number;
	public constructor(private changeDetector: ChangeDetectorRef) {}
	public ngOnInit(): void {
		this.nbOfNotification = this.nbOfNotification || 0;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (
			'nbOfNotification' in changes &&
			changes['nbOfNotification'].currentValue !== changes['nbOfNotification'].previousValue
		) {
			this.nbOfNotification = changes['nbOfNotification'].currentValue;
			this.changeDetector.detectChanges();
		}
	}

	public getNbOfNotifications(): string | number | undefined {
		if (this.nbOfNotification) {
			if (this.nbOfNotification > 9) {
				return '9+';
			}
			return this.nbOfNotification;
		}
		return undefined;
	}
}

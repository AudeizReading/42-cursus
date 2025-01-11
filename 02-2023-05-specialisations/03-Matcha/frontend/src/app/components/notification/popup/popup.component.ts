import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CrossComponent } from '@app/components/icons/cross/cross.component';
import { HeartComponent } from '@app/components/icons/heart/heart.component';
import { NotificationLevelType } from '@app/models/notification';

@Component({
	selector: 'app-notification-popup',
	standalone: true,
	imports: [HeartComponent, CrossComponent],
	templateUrl: './popup.component.html',
	styleUrl: './popup.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationPopupComponent {
	@Input() public level!: NotificationLevelType;
	@Input() public msg!: string;
	@Input() public labelAction?: string;
	@Output() public closePopup: EventEmitter<void> = new EventEmitter<void>();
	@Output() public actionPopup: EventEmitter<void> = new EventEmitter<void>();

	public getColorIcon(): string {
		switch (this.level) {
			case 'ACTION':
				return '#FD3F92';
			case 'ERROR':
				return '#FF0040';
			case 'SUCCESS':
				return '#34A853';
			case 'WARN':
				return '#FBBC05';
		}
	}

	public onClose(): void {
		this.closePopup.emit();
	}

	public onAction(): void {
		this.actionPopup.emit();
	}

	public getClassLevel(): string {
		return this.level.toLocaleLowerCase();
	}
}

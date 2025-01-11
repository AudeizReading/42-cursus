import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { EyeComponent } from '@app/components/icons/eye/eye.component';
import { TrashComponent } from '@app/components/icons/trash/trash.component';

@Component({
	selector: 'app-notification-card',
	standalone: true,
	imports: [EyeComponent, TrashComponent],
	templateUrl: './card.component.html',
	styleUrl: './card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifcationCardComponent implements OnInit, OnChanges {
	@Input() public urlPicture!: string;
	@Input() public displayName!: string;
	@Input() public isRead: boolean = true;
	@Input() public labelButton!: string;
	@Input() public message!: string;

	@Output() public actionNotif: EventEmitter<void> = new EventEmitter<void>();
	@Output() public deleteNotif: EventEmitter<void> = new EventEmitter<void>();

	public constructor(private changeDetector: ChangeDetectorRef) {}
	public ngOnInit(): void {
		this.urlPicture = this.urlPicture || '';
		this.displayName = this.displayName || '';
		this.isRead = this.isRead || false;
		this.labelButton = this.labelButton || '';
		this.message = this.message || '';
	}

	public ngOnChanges(changes: SimpleChanges): void {
		let hasChanged: boolean = false;
		if (changes['urlPicture'] && changes['urlPicture'].currentValue !== changes['urlPicture'].previousValue) {
			hasChanged = true;
			this.urlPicture = changes['urlPicture'].currentValue;
		}
		if (changes['displayName'] && changes['displayName'].currentValue !== changes['displayName'].previousValue) {
			hasChanged = true;
			this.displayName = changes['displayName'].currentValue;
		}

		if (changes['isRead'] && changes['isRead'].currentValue !== changes['isRead'].previousValue) {
			hasChanged = true;
			this.isRead = changes['isRead'].currentValue;
		}
		if (changes['labelButton'] && changes['labelButton'].currentValue !== changes['labelButton'].previousValue) {
			hasChanged = true;
			this.labelButton = changes['labelButton'].currentValue;
		}
		if (changes['message'] && changes['message'].currentValue !== changes['message'].previousValue) {
			hasChanged = true;
			this.message = changes['message'].currentValue;
		}

		if (hasChanged) this.changeDetector.detectChanges();
	}

	public onDelete(): void {
		this.deleteNotif.emit();
	}

	public onAction(): void {
		this.actionNotif.emit();
	}
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-message-preview',
	standalone: true,
	imports: [],
	templateUrl: './message-preview.component.html',
	styleUrl: './message-preview.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagePreviewComponent {
	@Input() public isOnline!: boolean;
	@Input() public lastMessageRead!: boolean;
	@Input() public displayName!: string;
	@Input() public lastMessage?: string;
	@Input() public urlPicture!: string;
	@Input() public timeStamp?: number;

	public getDate(): string {
		if (this.timeStamp) {
			return new Date(this.timeStamp).toUTCString();
		}
		return '';
	}
}

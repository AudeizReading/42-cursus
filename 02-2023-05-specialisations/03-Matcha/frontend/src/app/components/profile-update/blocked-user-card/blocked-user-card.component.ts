import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-blocked-user-card',
	standalone: true,
	imports: [],
	templateUrl: './blocked-user-card.component.html',
	styleUrl: './blocked-user-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockedUserCardComponent {
	@Input() public urlPicture!: string;
	@Input() public username!: string;
	@Input() public userId!: string;

	@Output() public unblock: EventEmitter<string> = new EventEmitter<string>();

	public onUnblock(): void {
		this.unblock.emit(this.userId);
	}
}

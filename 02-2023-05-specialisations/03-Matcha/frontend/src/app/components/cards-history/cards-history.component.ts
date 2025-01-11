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
import { CardProfileHistoryComponent } from '../card-profile-history/card-profile-history.component';
import { CardProfileHistory } from '@app/models';
import { CommonModule } from '@angular/common';
import { BlockedUserCardComponent } from '../profile-update/blocked-user-card/blocked-user-card.component';

@Component({
	selector: 'app-cards-history',
	standalone: true,
	imports: [CardProfileHistoryComponent, BlockedUserCardComponent, CommonModule],
	templateUrl: './cards-history.component.html',
	styleUrl: './cards-history.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsHistoryComponent implements OnChanges, OnInit {
	@Input() public history!: CardProfileHistory[];
	@Input() public type!: 'profile' | 'blocked';

	@Output() public unblock: EventEmitter<string> = new EventEmitter<string>();

	public constructor(private readonly changeDetector: ChangeDetectorRef) {}

	public ngOnInit(): void {
		if (!this.type) {
			this.type = 'profile';
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['history'] && changes['history'].currentValue !== changes['history'].previousValue) {
			this.history = [...changes['history'].currentValue];
			this.changeDetector.detectChanges();
		}
	}

	public onUnblockRequest(userId: string): void {
		if (this.type === 'blocked') {
			this.unblock.emit(userId);
		}
	}
}

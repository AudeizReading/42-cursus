import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'app-star-rating',
	standalone: true,
	imports: [IconComponent],
	templateUrl: './star-rating.component.html',
	styleUrl: './star-rating.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('show', [
			state('start', style({ opacity: 1 })),
			state('end', style({ opacity: 0 })),
			transition('start => end', [animate('0.5s ease-in-out')]),
			transition('end => start', [animate('0.5s ease-in-out')]),
		]),
	],
})
export class StarRatingComponent {
	@Input() public rating!: number;
	protected showRate: boolean = false;

	public onClick(): void {
		this.showRate = !this.showRate;
	}
}

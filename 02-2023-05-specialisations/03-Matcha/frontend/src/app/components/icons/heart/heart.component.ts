import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-icon-heart',
	standalone: true,
	imports: [],
	templateUrl: './heart.component.html',
	styleUrl: './heart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeartComponent {
	@Input() public color: string | undefined;
}

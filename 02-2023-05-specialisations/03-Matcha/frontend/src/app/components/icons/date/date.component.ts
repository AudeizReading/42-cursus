import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-date',
	standalone: true,
	imports: [],
	templateUrl: './date.component.html',
	styleUrl: './date.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateComponent {
	@Input() public color: string = 'white';
}

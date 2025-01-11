import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-email',
	standalone: true,
	imports: [],
	templateUrl: './email.component.html',
	styleUrl: './email.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailComponent {
	@Input() public color: string = 'white';
}

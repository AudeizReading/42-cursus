import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-icon-idle',
	standalone: true,
	imports: [],
	templateUrl: './idle.component.html',
	styleUrl: './idle.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdleComponent {
	@Input() public color: string | undefined;
}

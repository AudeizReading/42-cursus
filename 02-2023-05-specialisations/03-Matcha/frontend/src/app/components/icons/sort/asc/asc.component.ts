import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-icon-asc',
	standalone: true,
	imports: [],
	templateUrl: './asc.component.html',
	styleUrl: './asc.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AscComponent {
	@Input() public color: string | undefined;
}

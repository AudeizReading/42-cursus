import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-icon-cross',
	standalone: true,
	imports: [],
	templateUrl: './cross.component.html',
	styleUrl: './cross.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrossComponent {
	@Input() public color: string | undefined;
}

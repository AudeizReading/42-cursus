import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-icon-eye',
	standalone: true,
	imports: [],
	templateUrl: './eye.component.html',
	styleUrl: './eye.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EyeComponent {
	@Input() public color: string | undefined;
}

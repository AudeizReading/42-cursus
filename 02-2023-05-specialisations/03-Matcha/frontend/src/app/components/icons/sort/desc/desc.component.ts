import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-icon-desc',
	standalone: true,
	imports: [],
	templateUrl: './desc.component.html',
	styleUrl: './desc.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescComponent {
	@Input() public color: string | undefined;
}

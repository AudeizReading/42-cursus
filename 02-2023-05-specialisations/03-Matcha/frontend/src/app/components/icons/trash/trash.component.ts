import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-icon-trash',
	standalone: true,
	imports: [],
	templateUrl: './trash.component.html',
	styleUrl: './trash.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrashComponent {
	@Input() public color: string | undefined;
}

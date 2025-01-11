import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-save',
	standalone: true,
	imports: [],
	templateUrl: './save.component.html',
	styleUrl: './save.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveComponent {
	@Input() public color: string = 'white';
}

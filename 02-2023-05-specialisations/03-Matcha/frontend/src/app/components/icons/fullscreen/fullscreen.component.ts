import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-fullscreen',
	standalone: true,
	imports: [],
	templateUrl: './fullscreen.component.html',
	styleUrl: './fullscreen.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullscreenComponent {
	@Input() public color: string = 'white';
}

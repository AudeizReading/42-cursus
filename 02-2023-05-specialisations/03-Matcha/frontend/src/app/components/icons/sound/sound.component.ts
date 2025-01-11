import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-sound',
	standalone: true,
	imports: [],
	templateUrl: './sound.component.html',
	styleUrl: './sound.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundComponent {
	@Input() public color: string = 'white';
	@Input() public value?: string;
}

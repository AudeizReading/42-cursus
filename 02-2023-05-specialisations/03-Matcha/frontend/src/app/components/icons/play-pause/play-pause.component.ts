import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-play-pause',
	standalone: true,
	imports: [],
	templateUrl: './play-pause.component.html',
	styleUrl: './play-pause.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayPauseComponent {
	@Input() public color: string = 'white';
	@Input() public paused: boolean = true;
}

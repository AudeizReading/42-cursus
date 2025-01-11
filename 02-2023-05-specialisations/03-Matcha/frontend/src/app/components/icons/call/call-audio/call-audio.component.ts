import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-call-audio',
	standalone: true,
	imports: [],
	templateUrl: './call-audio.component.html',
	styleUrl: './call-audio.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallAudioComponent {}

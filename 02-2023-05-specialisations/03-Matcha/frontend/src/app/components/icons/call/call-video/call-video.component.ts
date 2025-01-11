import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-call-video',
	standalone: true,
	imports: [],
	templateUrl: './call-video.component.html',
	styleUrl: './call-video.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallVideoComponent {}

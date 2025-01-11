import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-webcam',
	standalone: true,
	imports: [],
	templateUrl: './webcam.component.html',
	styleUrl: './webcam.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebcamComponent {}

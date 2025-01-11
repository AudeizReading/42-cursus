import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-send',
	standalone: true,
	imports: [],
	templateUrl: './send.component.html',
	styleUrl: './send.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendComponent {}

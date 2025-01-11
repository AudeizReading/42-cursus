import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-load-spinner',
	standalone: true,
	imports: [],
	templateUrl: './load-spinner.component.html',
	styleUrl: './load-spinner.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadSpinnerComponent {}

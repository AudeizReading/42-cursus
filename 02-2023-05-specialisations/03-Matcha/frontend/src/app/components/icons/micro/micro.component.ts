import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-micro',
	standalone: true,
	imports: [],
	templateUrl: './micro.component.html',
	styleUrl: './micro.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroComponent {}

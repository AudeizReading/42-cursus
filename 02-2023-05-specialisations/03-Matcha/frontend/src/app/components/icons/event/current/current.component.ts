import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-current',
	standalone: true,
	imports: [],
	templateUrl: './current.component.html',
	styleUrl: './current.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentComponent {}

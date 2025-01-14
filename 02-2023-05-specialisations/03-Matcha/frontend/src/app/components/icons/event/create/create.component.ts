import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-create',
	standalone: true,
	imports: [],
	templateUrl: './create.component.html',
	styleUrl: './create.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent {}

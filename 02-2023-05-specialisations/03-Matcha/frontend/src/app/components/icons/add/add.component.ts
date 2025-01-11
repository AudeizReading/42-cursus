import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-add',
	standalone: true,
	imports: [],
	templateUrl: './add.component.html',
	styleUrl: './add.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddComponent {}

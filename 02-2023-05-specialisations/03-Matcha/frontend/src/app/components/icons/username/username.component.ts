import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-username',
	standalone: true,
	imports: [],
	templateUrl: './username.component.html',
	styleUrl: './username.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsernameComponent {}

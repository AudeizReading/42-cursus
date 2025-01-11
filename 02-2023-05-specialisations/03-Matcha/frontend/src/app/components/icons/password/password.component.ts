import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-password',
	standalone: true,
	imports: [],
	templateUrl: './password.component.html',
	styleUrl: './password.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SigninComponent as SignInIcon } from '../../icons/signin/signin.component';

@Component({
	selector: 'app-signin',
	standalone: true,
	imports: [SignInIcon],
	templateUrl: './signin.component.html',
	styleUrl: './signin.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {}

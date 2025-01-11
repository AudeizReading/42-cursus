import { Component } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

@Component({
	selector: 'app-recovery-password-button',
	standalone: true,
	imports: [],
	templateUrl: './recovery-password-button.component.html',
	styleUrl: './recovery-password-button.component.scss',
})
export class RecoveryPasswordButtonComponent {
	private state!: RouterStateSnapshot;
	public constructor(private router: Router) {
		this.state = this.router.routerState.snapshot;
	}

	public onClick(event: Event): void {
		event.preventDefault();
		this.router.navigate(['/recovery/password'], {
			state: {
				previousUrl: this.router.url,
				currentUrl: this.state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			},
		});
	}
}

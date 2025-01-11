import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { FormCompletionComponent, HeaderActionComponent } from '@app/components';
import { LayoutComponent } from '@app/layout';
import { SocketService } from '@app/shared';

@Component({
	selector: 'app-registration',
	standalone: true,
	imports: [CommonModule, LayoutComponent, HeaderActionComponent, FormCompletionComponent],
	templateUrl: './registration.component.html',
	styleUrl: './registration.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
	private state!: RouterStateSnapshot;

	public constructor(
		private router: Router,
		private readonly socketService: SocketService,
	) {
		this.state = this.router.routerState.snapshot;
	}
	protected checkedProfile(valid: boolean): void {
		if (valid) {
			this.socketService.askForConnection(() => {
				this.router.navigate(['/browsing'], {
					state: {
						previousUrl: this.router.url,
						currentUrl: this.state.url,
						code: 200,
						status: 'OK',
						message: 'Authorized',
					},
				});
			});
		}
	}
}

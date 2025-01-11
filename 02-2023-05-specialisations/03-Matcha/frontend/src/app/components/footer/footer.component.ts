import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterStateSnapshot } from '@angular/router';

@Component({
	selector: 'app-footer',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
	@Input() public shadow: boolean = false;
	@Input() public footerClasses: string = 'footer-home';
	@Input() public btnClasses: string = 'btn-base';
	@Input() public link: string = '/';

	private state!: RouterStateSnapshot;
	public constructor(private router: Router) {
		this.state = this.router.routerState.snapshot;
	}

	public onClick(event: Event): void {
		event.preventDefault();
		this.router.navigate([this.link], {
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

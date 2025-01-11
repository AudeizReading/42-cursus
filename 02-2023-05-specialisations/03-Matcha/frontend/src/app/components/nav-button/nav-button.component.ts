import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule, Router, RouterStateSnapshot } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
	selector: 'app-nav-button',
	standalone: true,
	imports: [CommonModule, RouterModule, ButtonComponent, IconComponent],
	templateUrl: './nav-button.component.html',
	styleUrl: './nav-button.component.scss',
})
export class NavButtonComponent {
	// Si on n'override pas les classes, le button sera de classe btn-primary par defaut
	@Input() public btnClasses: string = `btn-base btn-primary btn-md`;
	@Input() public link: string = '/';
	@Input() public icon: string | null = null;
	@Input() public iconClasses: string = 'icon-base';
	@Input() public iconType: string = 'fa';

	private state!: RouterStateSnapshot;
	public constructor(private router: Router) {
		this.state = this.router.routerState.snapshot;
	}

	public onClick(): void {
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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderActionComponent, ModalComponent, NavButtonComponent } from '@app/components';
import { LayoutComponent } from '@app/layout';

interface ErrorState {
	code: number;
	status: string;
	message: string;
	previousUrl: string;
	currentUrl: string;
}

@Component({
	selector: 'app-error',
	standalone: true,
	imports: [LayoutComponent, NavButtonComponent, ModalComponent, HeaderActionComponent],
	templateUrl: './error.component.html',
	styleUrl: './error.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
	public state: ErrorState = {
		code: 404,
		status: 'Not Found',
		message: 'Page Not Found',
		previousUrl: '/',
		currentUrl: '/',
	};

	public constructor(
		private router: Router,
		private location: Location,
	) {
		const navigation = this.router.getCurrentNavigation();
		if (navigation?.extras.state) {
			this.state = navigation.extras.state as ErrorState;
			this.location.go(this.state.currentUrl);
		}
	}

	protected get title(): string {
		return `${this.state.code} - ${this.state.status}`;
	}
}

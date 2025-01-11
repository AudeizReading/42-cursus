import { CommonModule } from '@angular/common';
import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { broadCastChannel } from '@app/models';
import {
	FormSigninComponent,
	LoadSpinnerComponent,
	OauthButtonComponent,
	RecoveryPasswordButtonComponent,
} from '@app/components';
import { LayoutComponent } from '@app/layout';
import { AlertFacade } from '@app/models';
import { AlertService, StorageService } from '@app/shared';

@Component({
	selector: 'app-home',
	standalone: true,
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	imports: [
		FormSigninComponent,
		CommonModule,
		LayoutComponent,
		LoadSpinnerComponent,
		OauthButtonComponent,
		RecoveryPasswordButtonComponent,
	],
})
export class HomeComponent extends AlertFacade implements OnInit {
	public isLogged: boolean;
	private state!: RouterStateSnapshot;

	public constructor(
		private storage: StorageService,
		private router: Router,
		alertService: AlertService,
		private ngZone: NgZone,
	) {
		super(alertService);
		this.state = this.router.routerState.snapshot;
		this.isLogged = this.storage.isAuth();
	}

	public ngOnInit(): void {
		broadCastChannel.onmessage = (event): void => {
			this.ngZone.run(() => {
				if (event.type === 'message') {
					if (event.data.type === 'logout') {
						this.storage.logout();
						this.router.navigate(['/'], {
							state: {
								previousUrl: this.router.url,
								currentUrl: this.state.url,
								code: 200,
								status: 'OK',
								message: 'Authorized',
							},
						});
					} else if (event.data.type === 'login') {
						this.router.navigate(['/browsing'], {
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
			});
		};
		this.isLogged = this.storage.isAuth();
		if (this.isLogged) {
			broadCastChannel.postMessage({ type: 'login', datas: { from: 'home', redirect: true } });
			this.router.navigate(['/browsing'], {
				state: {
					previousUrl: this.router.url,
					currentUrl: this.state.url,
					code: 200,
					status: 'OK',
					message: 'Authorized',
				},
			});
		} else {
			broadCastChannel.postMessage({ type: 'logout', datas: { from: 'home', redirect: true } });
		}
	}

	public onLogged(): void {
		this.isLogged = true;
		broadCastChannel.postMessage({
			type: 'login',
			datas: {
				previousUrl: this.router.url,
				currentUrl: this.state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			},
		});
		this.router.navigate(['/browsing'], {
			state: {
				previousUrl: this.router.url,
				currentUrl: this.state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			},
		});
	}

	@HostListener('window:storage', ['$event'])
	protected onStorageUpdate(event: StorageEvent): void {
		if (event.key === 'oauth') {
			if (event.newValue) {
				const datas = JSON.parse(event.newValue);
				if ('error' in datas) {
					this.alert('error', datas.error);
					window.localStorage.removeItem('oauth');
				} else if (this.storage.isAuth()) {
					broadCastChannel.postMessage({ type: 'oauth', payload: { from: 'home', datas } });
					this.alert('success', 'Welcome back!');
					this.router.navigate(['/browsing'], {
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
		} else if (event.key === 'access_key') {
			if (event.newValue?.length === 0) {
				this.isLogged = false;
				console;
				broadCastChannel.postMessage({ type: 'logout', datas: { from: 'home', redirect: true } });
			}
		}
	}

	public onFailed(): void {
		this.isLogged = false;
	}
}

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { FooterActionComponent, HeaderActionComponent, ProfileDetailsComponent } from '@app/components';
import { LayoutComponent } from '@app/layout';
import { ProfileDTO } from '@app/models';
import { AlertService, ProfileService } from '@app/shared';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, LayoutComponent, HeaderActionComponent, FooterActionComponent, ProfileDetailsComponent],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
	public profile!: ProfileDTO;
	protected me: boolean = false;

	protected activeBack: boolean = false;
	protected more: boolean = false;
	protected logout: boolean = false;

	private state!: RouterStateSnapshot;

	protected backTo: string = '';
	protected backName: string = 'Browsing';
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private profileService: ProfileService,
		private route: ActivatedRoute,
		private alertService: AlertService,
		private router: Router,
		private changeDetector: ChangeDetectorRef,
	) {
		this.state = this.router.routerState.snapshot;
	}

	public ngOnInit(): void {
		this.backTo = this.router.lastSuccessfulNavigation?.extras.state?.['previousUrl']
			? this.router.lastSuccessfulNavigation?.extras.state?.['previousUrl']
			: '/';
		if (/^\/chat\/conversation\/.*$/.test(this.backTo)) {
			this.backName = 'Conversation';
		} else if (/^\/research$/.test(this.backTo)) {
			this.backName = 'Search';
		}
		const id = this.route.snapshot.params['id'] || this.route.snapshot.url[0]?.path;
		this.profileService
			.getProfile()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((profile) => {
				const isMe = id === profile.id.toString() || id === 'me';
				if (isMe) {
					this.me = true;
					this.activeBack = false;
					this.more = false;
					this.logout = false;
					this.profile = { ...profile };
					this.changeDetector.detectChanges();
					if (id !== 'me')
						this.router.navigate(['/profile/me'], {
							state: {
								previousUrl: this.router.url,
								currentUrl: this.state.url,
								code: 200,
								status: 'OK',
								message: 'Authorized',
							},
						});
				} else {
					this.me = false;
					this.activeBack = true;
					this.more = true;
					this.logout = true;

					this.getProfileById(Number(id));
				}
			});
	}

	protected checkedProfile(valid: boolean): void {
		if (valid) {
			this.getMyProfile('me');
		}
	}

	private getMyProfile(id: string): void {
		this.profileService
			.getProfile()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (data) => {
					const isMe = id === data.id.toString() || id === 'me';
					if (isMe) {
						this.profile = { ...data };
						if (id === 'me') {
							this.profileService.emitProfile(this.profile);
						}
						this.me = true;
						this.activeBack = false;
						this.more = false;
						this.logout = false;
						if (id !== 'me')
							this.router.navigate(['/profile/me'], {
								state: {
									previousUrl: this.router.url,
									currentUrl: this.state.url,
									code: 200,
									status: 'OK',
									message: 'Authorized',
								},
							});
					}
				},
				error: (error) => {
					setTimeout(() => {
						this.alert('error', error.error.message);
					}, 200);
				},
			});
	}

	private getProfileById(id: number): void {
		this.profileService
			.getProfileById(String(id))
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (data) => {
					this.profile = { ...data } as ProfileDTO;
					this.profileService
						.addView(String(id))
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe({
							next: () => {},
						});
					this.changeDetector.detectChanges();
				},
				error: (error) => {
					this.router.navigate(['/error'], {
						state: {
							code: error.error.statusCode,
							status: error.error.message,
							message: error.error.error,
							previousUrl: '/browsing',
							currentUrl: `/profile/${id}`,
						},
					});
				},
			});
	}

	private alert(type: string, message: string): void {
		const opts = {
			keepAfterRouteChange: true,
			autoClose: true,
			fade: true,
			open: true,
		};
		switch (type) {
			case 'error':
				this.alertService.error(message, opts);
				break;
			case 'success':
				this.alertService.success(message, opts);
				break;
		}
	}
}

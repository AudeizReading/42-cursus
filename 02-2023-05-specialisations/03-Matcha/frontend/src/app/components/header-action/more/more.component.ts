import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { CurrentComponent } from '@app/components/icons/event/current/current.component';
import { LoaderComponent } from '@app/components/loader/loader.component';
import { AlertFacade } from '@app/models';
import { AlertService, ProfileService } from '@app/shared';

interface MoreDisplaySettings {
	loading: boolean;
	profile: boolean;
	block: boolean;
	report: boolean;
	username?: string;
	userId?: number;
}

@Component({
	selector: 'app-more',
	standalone: true,
	imports: [RouterModule, LoaderComponent, CurrentComponent],
	templateUrl: './more.component.html',
	styleUrl: './more.component.scss',
})
export class MoreComponent extends AlertFacade implements OnInit {
	@Output() public actionClick: EventEmitter<void> = new EventEmitter<void>();
	protected state!: RouterStateSnapshot;
	private destroyRef: DestroyRef = inject(DestroyRef);

	protected display: MoreDisplaySettings = {
		loading: true,
		profile: false,
		block: false,
		report: false,
		username: undefined,
		userId: undefined,
	};

	public constructor(
		protected router: Router,
		private route: ActivatedRoute,
		private profileService: ProfileService,
		alertService: AlertService,
	) {
		super(alertService);
		this.state = this.router.routerState.snapshot;
	}

	public ngOnInit(): void {
		if (this.router.url.match(/(profile|chat\/conversation)/) !== null) {
			this.display.userId = this.userIdParams;
			this.profileService
				.getProfileById(String(this.display.userId))
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (userProfile) => {
						if (this.router.url.match('/chat/conversation/') !== null) {
							this.display.profile = true;
						}
						this.display = {
							...this.display,
							...{
								username: userProfile.username,
								block: true,
								report: !(userProfile.iReportThisProfile ?? false),
								loading: false,
							},
						};
					},
					error: () => {
						this.display = { ...this.display, ...{ loading: false } };
					},
				});
		} else {
			this.display = { ...this.display, ...{ loading: false } };
		}
	}

	private get userIdParams(): number {
		return parseInt(
			this.route.snapshot.params['id'] || this.route.snapshot.url[this.route.snapshot.url.length - 1]?.path,
		);
	}

	public onBlock(): void {
		this.profileService
			.block(String(this.display.userId))
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: () => {
					this.alert('success', 'This profile is blocked');
					this.afterSuccessBlock();
				},
				error: (err) => {
					this.alert('error', err.error.message);
				},
			});
		this.afterAction();
	}

	public onReport(): void {
		this.profileService
			.report(String(this.display.userId))
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: () => {
					this.alert('success', 'This profile is reported');
				},
				error: (err) => {
					this.alert('error', err.error.message);
				},
			});
		this.afterAction();
	}

	public afterAction(): void {
		this.actionClick.emit();
	}

	public afterSuccessBlock(): void {
		if (this.router.url.match(/(profile)/) !== null) {
			this.router.navigate(['/']);
		}
		if (this.router.url.match(/(chat\/conversation)/) !== null) {
			this.router.navigate(['/chat']);
		}
	}
}

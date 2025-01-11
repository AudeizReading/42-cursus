import { CommonModule } from '@angular/common';
import {
	ApplicationRef,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	NgZone,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';

import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import {
	FooterActionComponent,
	HeaderActionComponent,
	FormUpdateProfileComponent,
	FormUpdatePrivateComponent,
	UpdatePicturesComponent,
	LocationComponent,
} from '@app/components';

import { LayoutComponent } from '@app/layout';
import {
	AlertFacade,
	LocationUpdateDTO,
	Profile,
	ProfileDTO,
	Tag,
	UpdatePrivateProfileAPIQuery,
	UpdatePublicProfileAPIQuery,
	UserHistoryCard,
} from '@app/models';
import { AlertService, ProfileService, UserService, UserHistoryService, ScrollendDirective } from '@app/shared';
import { switchMap } from 'rxjs';
import { OauthLinkComponent } from '@app/components/oauth-link/oauth-link.component';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { TagUpdateComponent } from '@app/components/tag-update/tag-update.component';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardsHistoryComponent } from '@app/components/cards-history/cards-history.component';

@Component({
	selector: 'app-update-profile',
	standalone: true,
	imports: [
		LayoutComponent,
		HeaderActionComponent,
		TabViewModule,
		ToolbarModule,
		FooterActionComponent,
		CommonModule,
		FormUpdateProfileComponent,
		CardsHistoryComponent,
		FormUpdatePrivateComponent,
		OauthLinkComponent,
		TagUpdateComponent,
		UpdatePicturesComponent,
		ScrollendDirective,
		LocationComponent,
	],
	templateUrl: './update-profile.component.html',
	styleUrl: './update-profile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProfileComponent extends AlertFacade implements OnInit, OnChanges {
	protected activeMainIndex: number = 0;
	protected activeSubMainIndex: number = 0;
	protected activeSubSubMainIndex: number = 0;
	private state!: RouterStateSnapshot;

	protected profile!: Profile;
	protected tags: Tag[] = [];
	protected limit: number = 10;
	protected history!: UserHistoryCard;

	protected tabViewStyles: { [key: string]: string | { [key: string]: string } } = {
		historyPanels: {
			'max-height': 'calc(100vh - max(10vh, 80px) - 140px - max(10vh, 50px))',
			height: '100%',
			width: '100%',
			display: 'flex',
		},
		picturesPanels: {
			'max-height': 'calc(100vh - max(10vh, 80px) - 100px - max(10vh, 50px))',
			height: '100%',
			width: '100%',
			'max-width': '95vw',
			display: 'flex',
			'justify-content': 'center',
		},
		publicPanels: {
			'max-height': 'calc(100vh - max(10vh, 80px) - 100px - max(10vh, 50px))',
			height: '100%',
			width: '100%',
			'max-width': '95vw',
			display: 'flex',
			'justify-content': 'center',
			'overflow-y': 'auto',
			'overflow-x': 'hidden',
		},
	};
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private profileService: ProfileService,
		private userService: UserService,
		protected historyService: UserHistoryService,
		alertService: AlertService,
		private changeDetector: ChangeDetectorRef,
		private route: ActivatedRoute,
		private router: Router,
		private ngZone: NgZone,
		private appRef: ApplicationRef,
	) {
		super(alertService);
		this.state = this.router.routerState.snapshot;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['profile'] && changes['profile'].currentValue !== changes['profile'].previousValue) {
			this.profile = { ...changes['profile'].currentValue };
		}
	}

	public ngOnInit(): void {
		this.profileService.profile$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				switchMap((profile) => {
					this.profile = new Profile(profile);
					if (this.profile && this.profile.tags) {
						this.tags = [...this.profile.getFullTags(false, false, false)];
					}
					return this.historyService.getLastHistory(this.limit);
				}),
			)
			.subscribe({
				next: (history) => {
					if (history) {
						this.history = new UserHistoryCard(history.clone());
						this.changeDetector.markForCheck();
					}
				},
			});
		this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
			this.activeMainIndex = +params['main'] || 0;
			this.activeSubMainIndex = +params['subMain'] || 0;
			this.activeSubSubMainIndex = +params['subSubMain'] || 0;
		});
	}

	public onMainTabChange(event: TabViewChangeEvent): void {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { main: (event as { index: number }).index },
			state: {
				previousUrl: this.router.url,
				currentUrl: this.state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			},
		});
	}

	public onSubMainTabChange(event: TabViewChangeEvent): void {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { subMain: (event as { index: number }).index },
			queryParamsHandling: 'merge',
			state: {
				previousUrl: this.router.url,
				currentUrl: this.state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			},
		});
	}

	public onPicturesSubMainTabChange(event: TabViewChangeEvent): void {
		try {
			this.checkDefaultPicturesState(this.profile);
			this.onSubMainTabChange(event);
		} catch (error) {
			this.alert('error', (error as Error).message);
		}
	}

	protected checkDefaultPicturesState(profile: Profile): void {
		//TODO: check if the profile has a default picture
		if (!profile.defaultPicture && !(profile.pictures && profile.pictures?.length > 0)) {
			throw new Error('You must have at least one picture to set a default picture.');
		} else if (!profile.defaultPicture && profile.pictures && profile.pictures?.length > 0) {
			this.userService
				.updateDefaultPicture(String(profile.pictures[0].id))
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: () => {
						this.alert('info', 'Default picture has been set.');
					},
				});
		}
	}

	public onSubSubMainTabChange(event: unknown): void {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { subSubMain: (event as { index: number }).index },
			queryParamsHandling: 'merge',
			state: {
				previousUrl: this.router.url,
				currentUrl: this.state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			},
		});
	}

	public onProfileDatasUpdate(profileDatas: UpdatePublicProfileAPIQuery | UpdatePrivateProfileAPIQuery): void {
		this.userService
			.updateProfile(profileDatas)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload) => {
					const { body, status } = payload;
					if (body && status === 200) {
						this.profile = new Profile(body);
						this.profileService.emitProfile(body);
						this.changeDetector.detectChanges();
						this.alert('success', 'Your profile has been updated successfully.');
					}
				},
				error: (error) => {
					this.alert('error', error.error.message);
				},
			});
	}

	public onDatasUpdatedByChildren(payload: LocationUpdateDTO): void {
		if (payload instanceof LocationUpdateDTO) {
			this.profile.coords = payload;
		}
		this.profileService.emitProfile(this.profile as ProfileDTO);
		this.changeDetector.detectChanges();
	}

	public onHistoryScrollEnd(idContainer: string): void {
		switch (idContainer) {
			case 'history-I-liked':
				if (this.history.pages.liked !== -1) {
					this.historyService
						.fetchFollowingLiked(this.history, this.limit, this.history.pages.liked)
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe({
							next: (history) => {
								this.history = new UserHistoryCard(history.clone());
								this.changeDetector.detectChanges();
							},
						});
				}
				break;
			case 'history-they-like-me':
				if (this.history.pages.likes !== -1) {
					this.historyService
						.fetchFollowingLiked(this.history, this.limit, this.history.pages.likes)
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe({
							next: (history) => {
								this.history = new UserHistoryCard(history.clone());
								this.changeDetector.detectChanges();
							},
						});
				}
				break;
			case 'history-I-viewed':
				if (this.history.pages.visited !== -1) {
					this.historyService
						.fetchFollowingVisited(this.history, this.limit, this.history.pages.visited)
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe({
							next: (history) => {
								this.history = new UserHistoryCard(history.clone());
								this.changeDetector.detectChanges();
							},
						});
				}
				break;
			case 'history-they-view-me':
				if (this.history.pages.views !== -1) {
					this.historyService
						.fetchFollowingViews(this.history, this.limit, this.history.pages.views)
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe({
							next: (history) => {
								this.history = new UserHistoryCard(history.clone());
								this.changeDetector.detectChanges();
							},
						});
				}
				break;
			case 'history-I-blocked':
				if (this.history.pages.blocked !== -1) {
					this.historyService
						.fetchFollowingBlocked(this.history, this.limit, this.history.pages.blocked)
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe({
							next: (history) => {
								this.history = new UserHistoryCard(history.clone());
								this.changeDetector.detectChanges();
							},
						});
				}
				break;
		}
	}

	public onUnblockRequest(userId: string): void {
		this.profileService
			.unblock(userId)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload) => {
					if (payload instanceof HttpResponse) {
						this.alert('success', 'User has been unblocked.');
						this.history.removeBlocked(userId);
						this.changeDetector.detectChanges();
					}
				},
				error: (error) => {
					this.alert('error', error.error.message);
				},
			});
	}
}

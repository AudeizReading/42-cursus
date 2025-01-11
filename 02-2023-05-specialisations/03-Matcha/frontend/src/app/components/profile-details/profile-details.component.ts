import {
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { AlertFacade, CoordinatesDTO, FileDTO, Profile, ProfileDTO, Tag, UserHistory } from '@app/models';
import { BadgeComponent } from '../badge/badge.component';
import { TagsComponent } from '../tags/tags.component';
import { CommonModule } from '@angular/common';
import { ProfilePicturesComponent } from '../carousel';
import { CityComponent } from '../city/city.component';
import {
	AlertService,
	ChatService,
	GridProfileDetailsDirective,
	GridTagsDirective,
	ProfileService,
	UserHistoryService,
} from '@app/shared';
import { map, Subscription } from 'rxjs';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { LikeComponent } from '../buttons/like/like.component';
import { Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-profile-details',
	standalone: true,
	imports: [
		CommonModule,
		BadgeComponent,
		TagsComponent,
		ProfilePicturesComponent,
		CityComponent,
		StarRatingComponent,
		GridTagsDirective,
		GridProfileDetailsDirective,
		LikeComponent,
		RouterModule,
	],
	templateUrl: './profile-details.component.html',
	styleUrl: './profile-details.component.scss',
})
export class ProfileDetailsComponent extends AlertFacade implements OnInit, OnChanges, OnDestroy {
	@Input() public profile!: ProfileDTO;
	private _profile!: ProfileDTO;
	protected _history!: UserHistory;
	private _profileSub!: Subscription;
	public me!: boolean;
	protected liked: boolean = false;
	protected match: boolean = false;
	public tags: Tag[];
	protected limit: number = 100;
	protected historyPages: { [key: string]: number } = {
		views: 0,
		visited: 0,
		likes: 0,
		liked: 0,
		matches: 0,
	};
	protected state!: RouterStateSnapshot;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private profileService: ProfileService,
		private historyService: UserHistoryService,
		private changeDetector: ChangeDetectorRef,
		private readonly chatService: ChatService,
		protected router: Router,
		alertService: AlertService,
	) {
		super(alertService);
		this.state = this.router.routerState.snapshot;
		this.tags = [];
		this._profileSub = this.profileService.profile$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				map((profile) => {
					this._profile = { ...profile };
					this.me = this._profile?.id === this.profile?.id;
					if (this.profile && this.profile.tags) {
						this.tags = [...this.userProfile.getFullTags(false, false, false)];
					}
				}),
			)
			.subscribe(() => {
				this.history();
			});

		this.chatService.onlineState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: (payload) => {
				if (this.profile?.id === payload.userId && this.profile?.status !== payload.status) {
					this.profile.status = payload.status;
					this.changeDetector.markForCheck();
				}
			},
		});
	}

	protected history(): void {
		const histSub = this.historyService
			.getLastHistory(this.limit)
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				map((data) => {
					this._history = data.clone();
					if (!this.me && this.profile) {
						this.liked = this._history.hasLikedUser(this.profile?.id);
						this.match = this._history.hasMatchedUser(this.profile?.id);
						this.changeDetector.detectChanges();
					}
				}),
			)
			.subscribe({
				error: (error) => {
					this.alert('error', error.message);
				},
				complete: () => {
					histSub.unsubscribe();
				},
			});
	}

	public ngOnInit(): void {
		if (this.profile && this.profile.tags) {
			this.me = this._profile?.id === this.profile?.id;
			this.tags = [...this.userProfile.getFullTags(false, false, false)];
			this.history();
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if ('profile' in changes && changes['profile'].currentValue !== changes['profile'].previousValue) {
			this.me = this._profile?.id === this.profile?.id;
			this.profile = { ...changes['profile'].currentValue };
			if (this.profile && this.profile.tags) {
				this.tags = [...this.userProfile.getFullTags(false, false, false)];
				this.history();
			}
		}
	}

	public get userProfile(): Profile {
		return this.profile ? new Profile({ ...this.profile }) : new Profile();
	}

	public get age(): number {
		return this.userProfile.getAge();
	}

	public get status(): string {
		const status = this.userProfile.status;
		if (!status || status !== 'ONLINE') return 'offline';
		return 'online';
	}

	public get lastCo(): string {
		const status = this.userProfile.status;
		if (!status || status === 'NOT_CONNECTED') return 'Never connected';
		if (status === 'ONLINE') return 'Online';
		return status;
	}

	public get pictures(): FileDTO[] {
		return this.userProfile.orderedPictures || [];
	}

	public get coords(): CoordinatesDTO {
		return this.userProfile.coords;
	}

	public get fameRating(): number {
		return this.userProfile.fameRating ?? 0;
	}

	public onLike(event: boolean): void {
		this.liked = event;
		if (event) {
			this.profileService
				.addLike(this.profile.id.toString())
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe(() => this.history());
		} else {
			this.profileService
				.removeLike(this.profile.id.toString())
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe(() => this.history());
		}
		this.changeDetector.detectChanges();
	}

	public ngOnDestroy(): void {
		this._profileSub.unsubscribe();
	}
}

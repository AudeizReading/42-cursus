import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { LocationDTO, Profile, ProfileDTO, Tag } from '@app/models';
import { BadgeComponent } from '../badge/badge.component';
import { LikeComponent } from '../buttons/like/like.component';
import { TagComponent } from '../tag/tag.component';
import { Router, RouterModule, RouterStateSnapshot } from '@angular/router';

@Component({
	selector: 'app-card-browsing',
	standalone: true,
	imports: [BadgeComponent, LikeComponent, TagComponent, RouterModule],
	templateUrl: './card-browsing.component.html',
	styleUrl: './card-browsing.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardBrowsingComponent implements OnChanges {
	@Input({ required: true }) public ownerPosition!: LocationDTO;
	@Input() public ownerTags: Tag[] = [];
	@Input({ required: true }) public profile!: ProfileDTO;
	@Input() public displayTag: boolean = false;
	@Input() public displayLikeUnlikeButton: boolean = true;
	@Output() public like: EventEmitter<{ like: boolean; id: number }> = new EventEmitter<{
		like: boolean;
		id: number;
	}>();
	protected state!: RouterStateSnapshot;

	public constructor(
		private changeDetector: ChangeDetectorRef,
		protected router: Router,
	) {
		this.state = this.router.routerState.snapshot;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (
			'ownerPosition' in changes &&
			changes['ownerPosition'].currentValue !== changes['ownerPosition'].previousValue
		) {
			this.ownerPosition = { ...changes['ownerPosition'].currentValue };
		}
		if ('ownerTags' in changes && changes['ownerTags'].currentValue !== changes['ownerTags'].previousValue) {
			this.ownerTags = [...changes['ownerTags'].currentValue];
		}
		if ('profile' in changes && changes['profile'].currentValue !== changes['profile'].previousValue) {
			this.profile = { ...changes['profile'].currentValue };
		}
		if ('displayTag' in changes && changes['displayTag'].currentValue !== changes['displayTag'].previousValue) {
			this.displayTag = changes['displayTag'].currentValue;
		}
		if (
			'displayLikeUnlikeButton' in changes &&
			changes['displayLikeUnlikeButton'].currentValue !== changes['displayLikeUnlikeButton'].previousValue
		) {
			this.displayLikeUnlikeButton = changes['displayLikeUnlikeButton'].currentValue;
		}
		this.changeDetector.detectChanges();
	}
	public getProfile(): Profile {
		return new Profile(this.profile);
	}

	public get isOnline(): string {
		return this.getProfile().isOnline ? 'online' : 'offline';
	}

	public get commonTags(): Tag[] {
		return this.getProfile().intersectionTags(this.ownerTags);
	}

	public get commonTagsCount(): number {
		return this.commonTags.length;
	}

	public onLike(like: boolean, id: number): void {
		this.like.emit({ like, id });
	}

	private toRadians(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	private haversineDistance(userA: LocationDTO, userB: LocationDTO): number {
		const R = 6371000;
		const dLat = this.toRadians(userB.latitude - userA.latitude);
		const dLon = this.toRadians(userB.longitude - userA.longitude);
		const a =
			Math.sin(dLat / 2) ** 2 +
			Math.cos(this.toRadians(userA.latitude)) *
				Math.cos(this.toRadians(userB.latitude)) *
				Math.sin(dLon / 2) ** 2;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	public get distance(): string | undefined {
		try {
			let userLocation: LocationDTO | undefined = undefined;
			switch (this.profile.locationType) {
				case 'FAKE':
					userLocation = this.profile.locations?.fake;
					break;
				case 'IP':
					userLocation = this.profile.locations?.ip;
					break;
				case 'NAVIGATOR':
					userLocation = this.profile.locations?.navigator;
					break;
			}
			if (userLocation === undefined || this.ownerPosition === undefined) return undefined;
			const dist = Math.round(this.haversineDistance(this.ownerPosition, userLocation));

			const km = Math.round(dist / 1000);
			const m = dist % 1000;

			let ret = `${km} km`;
			if (km & m) ret += ` and ${m} m`;
			else ret = `${m} m`;
			return ret;
		} catch {
			return undefined;
		}
	}
}

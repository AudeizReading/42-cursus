import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FooterActionComponent, HeaderActionComponent } from '@app/components';
import { CardBrowsingComponent } from '@app/components/card-browsing/card-browsing.component';
import { LoaderComponent } from '@app/components/loader/loader.component';
import { SearchBarBrowsingComponent } from '@app/components/search/search-bar-browsing/search-bar-browsing.component';
import { LayoutComponent } from '@app/layout';
import { createLocationDTO, LocationDTO, Profile, ProfileDTO, Tag } from '@app/models';
import { IBrowsingSearch } from '@app/models/browser';
import { BrowserService, ProfileService } from '@app/shared';
import { map, filter, switchMap } from 'rxjs';

@Component({
	selector: 'app-browsing',
	standalone: true,
	imports: [
		CommonModule,
		LayoutComponent,
		HeaderActionComponent,
		FooterActionComponent,
		SearchBarBrowsingComponent,
		CardBrowsingComponent,
		LoaderComponent,
	],
	templateUrl: './browsing.component.html',
	styleUrl: './browsing.component.scss',
})
export class BrowsingComponent implements OnInit {
	protected isOk: boolean;

	private currentUser: number = 0;
	private howManyUser: number = 10;
	private search: IBrowsingSearch = {};
	protected end: boolean = false;

	public profiles: ProfileDTO[] = [];
	public loading: boolean = false;

	public ownerPosition: LocationDTO = createLocationDTO({});
	private destroyRef: DestroyRef = inject(DestroyRef);

	protected ownerTags: Tag[] = [];

	public constructor(
		private profileService: ProfileService,
		private browserService: BrowserService,
		private changeDetector: ChangeDetectorRef,
	) {
		this.isOk = false;
	}

	public ngOnInit(): void {
		this.loading = true;
		this.changeDetector.detectChanges();
		this.profileService.profile$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				map((profile) => {
					const p = new Profile(profile);
					this.ownerTags = p.getFullTags(false, false, false);
					if (p.location) this.ownerPosition = createLocationDTO(p.location);

					return Profile.isComplete(profile);
				}),
				filter((completed) => completed === true),
				switchMap(() => {
					this.isOk = true;
					return this.browserService
						.browse({
							currentUser: this.currentUser,
							howManyUser: this.howManyUser,
							...this.search,
						})
						.pipe(takeUntilDestroyed(this.destroyRef));
				}),
			)
			.subscribe({
				next: (v) => {
					if (v && v.results) {
						if (v.results.length < this.howManyUser) this.end = true;
						this.profiles = [...v.results];
						this.loading = false;
						this.changeDetector.detectChanges();
					}
				},
			});
	}

	public onSearch(event: IBrowsingSearch): void {
		this.currentUser = 0;
		this.end = false;
		this.search = event;
		this.newSearch();
		this.changeDetector.detectChanges();
	}

	public newSearch(): void {
		this.loading = true;
		this.changeDetector.detectChanges();
		this.browserService
			.browse({
				currentUser: this.currentUser,
				howManyUser: this.howManyUser,
				...this.search,
			})
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (v) => {
					if (v && v.results) {
						if (v.results.length < this.howManyUser) this.end = true;
						this.profiles = [...v.results];
						this.loading = false;
						this.changeDetector.detectChanges();
					}
				},
			});
	}

	public addProfiles(): void {
		if (this.end || this.loading) return;
		this.loading = true;
		this.changeDetector.detectChanges();
		this.browserService
			.browse({
				currentUser: this.currentUser,
				howManyUser: this.howManyUser,
				...this.search,
			})
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (v) => {
					if (v && v.results) {
						if (v.results.length < this.howManyUser) this.end = true;
						this.profiles = [...this.profiles, ...v.results];
						this.loading = false;
						this.changeDetector.detectChanges();
					}
				},
			});
	}

	public removeProfile(id: number): void {
		this.profiles = [...this.profiles.filter((profile) => profile.id !== id)];
		this.changeDetector.detectChanges();
	}

	public onActionLike(event: { like: boolean; id: number }): void {
		const like = event.like;
		if (like) {
			this.profileService
				.addLike(event.id.toString())
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: () => {
						this.removeProfile(event.id);
						if (this.profiles.length === 0) this.addProfiles();
					},
				});
		} else {
			this.profileService
				.dislike(event.id.toString())
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: () => {
						this.removeProfile(event.id);
						if (this.profiles.length === 0) this.addProfiles();
					},
				});
		}
	}
}

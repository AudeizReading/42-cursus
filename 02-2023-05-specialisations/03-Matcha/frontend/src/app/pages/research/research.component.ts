import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FooterActionComponent, HeaderActionComponent } from '@app/components';
import { CardBrowsingComponent } from '@app/components/card-browsing/card-browsing.component';
import { SearchBarResearchComponent } from '@app/components/search/search-bar-research/search-bar-research.component';
import { LayoutComponent } from '@app/layout';
import { AlertFacade, createLocationDTO, LocationDTO, Profile, ProfileDTO, Tag } from '@app/models';
import { BrowserApiBodyDTO, BrowserApiQueryDTO } from '@app/models/browser';
import { AlertService, BrowserService, ProfileService, ScrollendDirective } from '@app/shared';
import { LoaderComponent } from '../../components/loader/loader.component';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface ResearchCongig {
	isOk: boolean;
	loader: boolean;
	end: boolean;
	canScroll: boolean;
	howManyUser: number;
	currentUser: number;
}
@Component({
	selector: 'app-research',
	standalone: true,
	imports: [
		CommonModule,
		LayoutComponent,
		HeaderActionComponent,
		FooterActionComponent,
		SearchBarResearchComponent,
		CardBrowsingComponent,
		LoaderComponent,
		ScrollendDirective,
	],
	templateUrl: './research.component.html',
	styleUrl: './research.component.scss',
})
export class ResearchComponent extends AlertFacade implements OnInit {
	protected config: ResearchCongig = {
		isOk: false,
		loader: false,
		end: false,
		canScroll: true,
		howManyUser: 10,
		currentUser: 0,
	};
	private searchValue: { query?: BrowserApiQueryDTO; body?: BrowserApiBodyDTO } = {};
	protected profiles: ProfileDTO[] = [];
	protected ownerPosition!: LocationDTO;
	public ownerTag: Tag[] = [];
	@ViewChild('research') public researchContainer!: ElementRef;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private profileService: ProfileService,
		alertService: AlertService,
		private browserService: BrowserService,
	) {
		super(alertService);
	}

	public ngOnInit(): void {
		this.profileService.profile$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((profile) => {
			const owner = new Profile(profile);
			if (!owner.location) return;
			this.ownerPosition = createLocationDTO(owner.location);
			this.config = { ...this.config, isOk: true };
			this.search();
		});
	}

	public onSearch(data: { query?: BrowserApiQueryDTO; body?: BrowserApiBodyDTO }): void {
		this.config = { ...this.config, currentUser: 0, howManyUser: 10 };
		this.searchValue = { ...data };
		this.search();
	}

	private search(): void {
		this.config = { ...this.config, loader: true };
		this.searchValue.query = {
			...this.searchValue.query,
			howManyUser: this.config.howManyUser,
			currentUser: this.config.currentUser,
		};

		this.browserService
			.search(this.searchValue.query!, this.searchValue.body!)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (d) => {
					if (d instanceof HttpResponse) {
						const { body } = d;
						if (body) {
							this.config = {
								...this.config,
								end: body.results.length < this.config.howManyUser ? true : false,
								currentUser: this.config.currentUser + body.results.length,
								loader: false,
							};
							this.profiles = [...body.results];
						}
					}
				},
				error: () => {
					this.alert('error', 'There was an error while searching');
				},
			});
	}

	public onScroll(idContainer: string): void {
		if (idContainer === 'research-card-container') {
			if (this.config.end || this.config.loader) return;

			this.addProfiles();
			this.config = { ...this.config, canScroll: false };
		}
	}

	private addProfiles(): void {
		if (this.config.end || this.config.loader) return;
		this.config = { ...this.config, loader: true };
		this.searchValue.query = this.searchValue.query = {
			...this.searchValue.query,
			howManyUser: this.config.howManyUser,
			currentUser: this.config.currentUser,
		};
		this.browserService
			.search(this.searchValue.query!, this.searchValue.body!)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (d) => {
					if (d instanceof HttpResponse) {
						const { body } = d;
						if (body) {
							this.config = {
								...this.config,
								end: body.results.length < this.config.howManyUser ? true : false,
								currentUser: this.config.currentUser + body.results.length,
								loader: false,
								canScroll: body.results.length === this.config.howManyUser ? true : false,
							};
							this.profiles.push(...body.results);
						}
					}
				},
			});
	}
}

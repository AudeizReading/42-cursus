import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { SearchTagComponent } from '../tag/tag.component';
import { ITag } from '@app/models';
import { GapComponent } from '@app/components/gap/gap.component';
import { SortComponent } from '@app/components/sort/sort.component';
import {
	BrowserApiBodyDTO,
	BrowserApiQueryDTO,
	OrderByBrowsingType,
	SortObjectType,
	SortType,
	Range,
} from '@app/models/browser';
import { TagComponent } from '@app/components/tag/tag.component';

@Component({
	selector: 'app-search-bar-research',
	standalone: true,
	imports: [SearchTagComponent, GapComponent, SortComponent, TagComponent],
	templateUrl: './search-bar-research.component.html',
	styleUrl: './search-bar-research.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarResearchComponent {
	@Output() public search: EventEmitter<{ query?: BrowserApiQueryDTO; body?: BrowserApiBodyDTO }> = new EventEmitter<{
		query?: BrowserApiQueryDTO;
		body?: BrowserApiBodyDTO;
	}>();

	private column: OrderByBrowsingType = 'location';
	private order: SortType | undefined = undefined;

	public orders: (SortType | undefined)[] = [undefined, undefined, undefined, undefined];
	private defaultAgeMin = 18;
	private defaultAgeMax = 100;
	private defaultFameRatingMin = -1000;
	private defaultFameRatingMax = 1000;
	private defaultLocationMin = 0;
	private defaultLocationMax = 200;
	public age = {
		min: this.defaultAgeMin,
		max: this.defaultAgeMax,
	};
	public fameRating = {
		min: this.defaultFameRatingMin,
		max: this.defaultFameRatingMax,
	};
	public location = {
		min: this.defaultLocationMin,
		max: this.defaultLocationMax,
	};
	public tags: ITag[] = [];

	public isOpen: boolean = false;

	public onChangeSort(sort: SortObjectType): void {
		this.column = sort.column;
		this.order = sort.order;
		switch (this.column) {
			case 'location':
				this.setLocation();
				break;
			case 'age':
				this.setAge();
				break;
			case 'commonTag':
				this.setCommonTag();
				break;
			case 'fameRating':
				this.setFameRating();
				break;
		}
		this.emit();
	}

	public onChangeGap(event: { column: OrderByBrowsingType; min: number; max: number }): void {
		switch (event.column) {
			case 'age':
				this.age.min = event.min;
				this.age.max = event.max;
				break;
			case 'fameRating':
				this.fameRating.min = event.min;
				this.fameRating.max = event.max;
				break;
			case 'location':
				this.location.min = event.min;
				this.location.max = event.max;
				break;
		}
		this.emit();
	}

	private setLocation(): void {
		this.orders = [this.order, undefined, undefined, undefined];
	}
	private setFameRating(): void {
		this.orders = [undefined, this.order, undefined, undefined];
	}
	private setCommonTag(): void {
		this.orders = [undefined, undefined, this.order, undefined];
	}
	private setAge(): void {
		this.orders = [undefined, undefined, undefined, this.order];
	}

	public addTag(tag: ITag): void {
		if (!this.tags.includes(tag)) this.tags = [...this.tags, tag];
		this.emit();
	}

	private getValueSearch(): { query?: BrowserApiQueryDTO; body?: BrowserApiBodyDTO } {
		let query: BrowserApiQueryDTO = {};
		let body: BrowserApiBodyDTO = {};
		if (this.order) {
			query = { ...query, sortBy: this.order, orderBy: this.column };
		}
		const tagIds = this.tags.map((v) => v.id);
		if (tagIds.length) {
			body = { ...body, tagIds };
		}
		if (this.age.min > this.defaultAgeMin || this.age.max < this.defaultAgeMax) {
			let ageRange: Range = {};
			if (this.age.min > this.defaultAgeMin) {
				ageRange = { ...ageRange, min: this.age.min };
			}
			if (this.age.max < this.defaultAgeMax) {
				ageRange = { ...ageRange, max: this.age.max };
			}
			body = { ...body, ageRange };
		}
		if (this.location.min > this.defaultLocationMin || this.location.max < this.defaultLocationMax) {
			let distanceRange: Range = {};
			if (this.location.min > this.defaultLocationMin) {
				distanceRange = { ...distanceRange, min: this.location.min };
			}
			if (this.location.max < this.defaultLocationMax) {
				distanceRange = { ...distanceRange, max: this.location.max };
			}
			body = { ...body, distanceRange };
		}
		if (this.fameRating.min > this.defaultFameRatingMin || this.fameRating.max < this.defaultFameRatingMax) {
			let fameRatingRange: Range = {};
			if (this.fameRating.min > this.defaultFameRatingMin) {
				fameRatingRange = { ...fameRatingRange, min: this.fameRating.min };
			}
			if (this.fameRating.max < this.defaultFameRatingMax) {
				fameRatingRange = { ...fameRatingRange, max: this.fameRating.max };
			}
			body = { ...body, fameRatingRange };
		}
		if (Object.keys(query).length > 0 && Object.keys(body).length > 0) {
			return { query, body };
		}
		if (Object.keys(query).length > 0) {
			return { query };
		}
		if (Object.keys(body).length > 0) {
			return { body };
		}
		return {};
	}

	private emit(): void {
		this.search.emit(this.getValueSearch());
	}

	public onDeleteTag(tagName: string): void {
		this.tags = this.tags.filter((v) => v.name != tagName);
		this.emit();
	}

	public toggleOpen(): void {
		this.isOpen = !this.isOpen;
	}
}

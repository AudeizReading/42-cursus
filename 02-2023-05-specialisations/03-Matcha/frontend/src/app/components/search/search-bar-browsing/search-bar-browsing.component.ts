import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { GapComponent } from '@app/components/gap/gap.component';
import { SortComponent } from '@app/components/sort/sort.component';
import { IBrowsingSearch, OrderByBrowsingType, SortObjectType, SortType } from '@app/models/browser';

@Component({
	selector: 'app-search-bar-browsing',
	standalone: true,
	imports: [GapComponent, SortComponent],
	templateUrl: './search-bar-browsing.component.html',
	styleUrl: './search-bar-browsing.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarBrowsingComponent {
	@Output() public search: EventEmitter<IBrowsingSearch> = new EventEmitter<IBrowsingSearch>();

	private column: OrderByBrowsingType = 'location';
	private order: SortType | undefined = undefined;

	public isOpen: boolean = false;

	public orders: (SortType | undefined)[] = [undefined, undefined, undefined, undefined];
	private defaultAgeMin = 18;
	private defaultAgeMax = 100;
	private defaultCommonTagMin = 0;
	private defaultCommonTagMax = 10;
	private defaultFameRatingMin = -1000;
	private defaultFameRatingMax = 1000;
	private defaultLocationMin = 0;
	private defaultLocationMax = 200;
	public age = {
		min: this.defaultAgeMin,
		max: this.defaultAgeMax,
	};
	public commonTag = {
		min: this.defaultCommonTagMin,
		max: this.defaultCommonTagMax,
	};
	public fameRating = {
		min: this.defaultFameRatingMin,
		max: this.defaultFameRatingMax,
	};
	public location = {
		min: this.defaultLocationMin,
		max: this.defaultLocationMax,
	};

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
			case 'commonTag':
				this.commonTag.min = event.min;
				this.commonTag.max = event.max;
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

	private getValueSearch(): IBrowsingSearch {
		let values = {};
		if (this.order) {
			values = { ...values, sortBy: this.order, orderBy: this.column };
		}
		if (this.age.min > this.defaultAgeMin) {
			values = { ...values, ageMin: this.age.min };
		}
		if (this.age.max < this.defaultAgeMax) {
			values = { ...values, ageMax: this.age.max };
		}
		if (this.location.min > this.defaultLocationMin) {
			values = { ...values, locationMin: this.location.min };
		}
		if (this.location.max < this.defaultLocationMax) {
			values = { ...values, locationMax: this.location.max };
		}
		if (this.commonTag.min > this.defaultCommonTagMin) {
			values = { ...values, commonTagMin: this.commonTag.min };
		}
		if (this.commonTag.max < this.defaultCommonTagMax) {
			values = { ...values, commonTagMax: this.commonTag.max };
		}
		if (this.fameRating.min > this.defaultFameRatingMin) {
			values = { ...values, fameRatingMin: this.fameRating.min };
		}
		if (this.fameRating.max < this.defaultFameRatingMax) {
			values = { ...values, fameRatingMax: this.fameRating.max };
		}
		return values;
	}

	private emit(): void {
		this.search.emit(this.getValueSearch());
	}

	public toggleOpen(): void {
		this.isOpen = !this.isOpen;
	}
}

import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { AscComponent } from '../icons/sort/asc/asc.component';
import { DescComponent } from '../icons/sort/desc/desc.component';
import { IdleComponent } from '../icons/sort/idle/idle.component';
import { OrderByBrowsingType, SortObjectType, SortType } from '@app/models/browser';

@Component({
	selector: 'app-sort',
	standalone: true,
	imports: [AscComponent, DescComponent, IdleComponent],
	templateUrl: './sort.component.html',
	styleUrl: './sort.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortComponent {
	@Input() public order: SortType | undefined = undefined;
	@Input() public column!: OrderByBrowsingType;
	@Input() public label: string = '';

	@Output() public changeSort: EventEmitter<SortObjectType> = new EventEmitter<SortObjectType>();

	public onButtonClick(): void {
		switch (this.order) {
			case undefined:
				this.order = 'ASC';
				break;
			case 'ASC':
				this.order = 'DESC';
				break;
			case 'DESC':
				this.order = undefined;
				break;
		}
		this.changeSort.emit({
			column: this.column,
			order: this.order,
		});
	}
}

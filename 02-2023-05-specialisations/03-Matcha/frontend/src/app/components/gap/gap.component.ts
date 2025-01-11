import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
	ViewEncapsulation,
	OnInit,
} from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { OrderByBrowsingType } from '@app/models/browser';

@Component({
	selector: 'app-gap',
	standalone: true,
	imports: [MatSliderModule],
	templateUrl: './gap.component.html',
	styleUrl: './gap.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class GapComponent implements OnInit {
	@Input() public min!: number;
	@Input() public max!: number;
	@Input() public column!: OrderByBrowsingType;

	public minValue: number = -1;
	public maxValue: number = -1;

	public ngOnInit(): void {
		this.minValue = this.min;
		this.maxValue = this.max;
	}

	@Output() public changeGap: EventEmitter<{ column: OrderByBrowsingType; min: number; max: number }> =
		new EventEmitter<{
			column: OrderByBrowsingType;
			min: number;
			max: number;
		}>();

	public change(event: Event): void {
		const target = event.target as unknown as { id: string; value: number };
		switch (target.id) {
			case 'min':
				this.min = target.value;
				break;
			case 'max':
				this.max = target.value;
				break;
		}
		this.changeGap.emit({ column: this.column, min: this.min, max: this.max });
	}
}

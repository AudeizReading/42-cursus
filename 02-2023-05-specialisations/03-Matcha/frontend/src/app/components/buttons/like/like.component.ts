import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { IconComponent } from '@app/components/icon/icon.component';

@Component({
	selector: 'app-like',
	standalone: true,
	imports: [IconComponent],
	templateUrl: './like.component.html',
	styleUrl: './like.component.scss',
})
export class LikeComponent implements OnInit, OnChanges {
	@Input() public liked!: boolean;
	@Output() public like: EventEmitter<boolean> = new EventEmitter<boolean>();

	public constructor(private changeDetector: ChangeDetectorRef) {}
	public onClick(): void {
		this.like.emit(this.liked);
	}

	public ngOnInit(): void {
		this.liked = this.liked || false;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if ('liked' in changes && changes['liked'].currentValue !== changes['liked'].previousValue) {
			this.liked = changes['liked'].currentValue;
			this.changeDetector.detectChanges();
		}
	}
}

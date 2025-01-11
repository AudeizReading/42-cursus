import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
	OnChanges,
	SimpleChanges,
	ChangeDetectorRef,
} from '@angular/core';
import {
	PicturePreviewAction,
	PicturePreviewComponent,
	PicturePreviewConfig,
	PreviewPlaceholderComponent,
} from '../..';

@Component({
	selector: 'app-main-preview',
	standalone: true,
	imports: [PicturePreviewComponent, PreviewPlaceholderComponent],
	templateUrl: './main-preview.component.html',
	styleUrl: './main-preview.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPreviewComponent implements OnChanges {
	@Input() public config!: PicturePreviewConfig;
	@Output() public clickAction: EventEmitter<PicturePreviewAction> = new EventEmitter<PicturePreviewAction>();

	public constructor(private cdr: ChangeDetectorRef) {}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['config'] && changes['config'].currentValue !== changes['config'].previousValue) {
			this.config = { ...changes['config'].currentValue };
			this.cdr.detectChanges();
		}
	}

	protected onClick(config: PicturePreviewAction): void {
		this.clickAction.emit(config);
	}
}

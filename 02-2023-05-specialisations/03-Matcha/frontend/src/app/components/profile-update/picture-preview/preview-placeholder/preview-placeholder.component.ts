import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { PicturePreviewAction, PicturePreviewConfig } from '../..';

@Component({
	selector: 'app-preview-placeholder',
	standalone: true,
	imports: [],
	templateUrl: './preview-placeholder.component.html',
	styleUrl: './preview-placeholder.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewPlaceholderComponent implements OnChanges {
	@Input() public config!: PicturePreviewConfig;
	@Output() public clickAction: EventEmitter<PicturePreviewAction> = new EventEmitter<PicturePreviewAction>();

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['config'] && changes['config'].currentValue !== changes['config'].previousValue) {
			this.config = { ...changes['config'].currentValue };
		}
	}

	public onClick(): void {
		this.clickAction.emit({ action: 'placeholder', config: this.config });
	}
}

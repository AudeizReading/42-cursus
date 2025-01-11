import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import {
	PicturePreviewAction,
	PicturePreviewActionType,
	PicturePreviewConfig,
	PreviewActionButtonComponent,
} from '../..';

@Component({
	selector: 'app-picture-preview',
	standalone: true,
	imports: [PreviewActionButtonComponent],
	templateUrl: './picture-preview.component.html',
	styleUrl: './picture-preview.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PicturePreviewComponent implements OnChanges {
	@Input() public config!: PicturePreviewConfig;
	@Output() public clickAction: EventEmitter<PicturePreviewAction> = new EventEmitter<PicturePreviewAction>();

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['config'] && changes['config'].currentValue !== changes['config'].previousValue) {
			this.config = { ...changes['config'].currentValue };
		}
	}

	protected get renderBtnsAction(): PicturePreviewActionType[] {
		const actions: PicturePreviewActionType[] = ['delete'];
		if (this.config.role === 'aux') {
			actions.push('choose');
		}
		return actions;
	}

	protected onClick(action: PicturePreviewActionType): void {
		this.clickAction.emit({ action, config: this.config });
	}
}

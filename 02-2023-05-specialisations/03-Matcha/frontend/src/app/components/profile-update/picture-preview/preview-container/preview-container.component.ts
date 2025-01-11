import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { AuxiliaryPreviewComponent, MainPreviewComponent, PicturePreviewAction, PicturePreviewConfig } from '../..';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-preview-container',
	standalone: true,
	imports: [MainPreviewComponent, AuxiliaryPreviewComponent, CommonModule],
	templateUrl: './preview-container.component.html',
	styleUrl: './preview-container.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewContainerComponent implements OnChanges {
	@Input() public main!: PicturePreviewConfig;
	@Input() public aux!: PicturePreviewConfig[];

	@Output() public clickAction: EventEmitter<PicturePreviewAction> = new EventEmitter<PicturePreviewAction>();

	public constructor(private cdr: ChangeDetectorRef) {}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['main'] && changes['main'].currentValue !== changes['main'].previousValue) {
			this.main = { ...changes['main'].currentValue };
			this.cdr.detectChanges();
		}
		if (changes['aux'] && changes['aux'].currentValue !== changes['aux'].previousValue) {
			this.aux = [...changes['aux'].currentValue];
			this.cdr.detectChanges();
		}
	}

	protected onClick(action: PicturePreviewAction): void {
		this.clickAction.emit(action);
	}
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PicturePreviewActionType } from '../../..';

@Component({
	selector: 'app-preview-action-button',
	standalone: true,
	imports: [],
	templateUrl: './preview-action-button.component.html',
	styleUrl: './preview-action-button.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewActionButtonComponent implements OnInit {
	@Input() public colorIcon!: string;
	@Input() public action: PicturePreviewActionType = 'delete';
	@Output() public clickAction: EventEmitter<PicturePreviewActionType> = new EventEmitter<PicturePreviewActionType>();

	public ngOnInit(): void {
		if (!this.colorIcon) {
			this.colorIcon = '#FD3F92';
		}
	}

	public onClick(): void {
		this.clickAction.emit(this.action);
	}
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-message-preview-loading',
	standalone: true,
	imports: [],
	templateUrl: './message-preview-loading.component.html',
	styleUrl: './message-preview-loading.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagePreviewLoadingComponent {}

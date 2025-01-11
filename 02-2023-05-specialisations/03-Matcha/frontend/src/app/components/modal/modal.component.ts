import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-modal',
	standalone: true,
	imports: [],
	templateUrl: './modal.component.html',
	styleUrl: './modal.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {}

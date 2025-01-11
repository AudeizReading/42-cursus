import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-button',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss',
})
export class ButtonComponent {
	@Input() public type: 'button' | 'submit' | 'reset' = 'button';
	@Input() public btnClasses: string = `btn-base btn-primary btn-md`;
	@Output() public triggered: EventEmitter<void> = new EventEmitter<void>();

	public constructor() {}
	public onClick(): void {
		this.triggered.emit();
	}
}

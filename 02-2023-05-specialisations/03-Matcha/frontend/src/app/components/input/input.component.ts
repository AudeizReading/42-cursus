import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-input',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './input.component.html',
	styleUrl: './input.component.scss',
	animations: [
		trigger('fade', [
			state(
				'open',
				style({
					opacity: 1,
					transform: 'translateY(0) scale(1) rotateY(0)',
					filter: 'blur(0) saturate(1)',
				}),
			),
			state(
				'closed',
				style({
					opacity: 0,
					transform: 'translateY(20px) scale(1.1) rotateY(5deg)',
					filter: 'blur(2px) saturate(0.5)',
				}),
			),
			transition('closed => open', [animate('3s 2s ease-in')]),
			transition('open => closed', [animate('2s 3s ease-out')]),
		]),
	],
})
export class InputComponent implements OnInit {
	@Input() public parentForm!: FormGroup;
	@Input() public id!: string;
	@Input() public type?: string;
	@Input() public placeholder?: string;
	@Input() public tooltip?: string;
	@Input() public disabled!: boolean;
	@Input() public inputClasses?: string;
	@Input() public labelClasses?: string;
	@Input() public multiple!: boolean;
	@Input() public max?: number;
	@Output() public inputInput: EventEmitter<Event> = new EventEmitter<Event>();
	@Output() public inputChange: EventEmitter<Event> = new EventEmitter<Event>();
	@Output() public inputClick: EventEmitter<Event> = new EventEmitter<Event>();
	@Output() public inputBlur: EventEmitter<Event> = new EventEmitter<Event>();
	@Output() public inputFocus: EventEmitter<Event> = new EventEmitter<Event>();
	protected focused: boolean;
	protected isTyping: boolean;

	public constructor() {
		if (!this.id) this.id = '';
		if (!this.type) this.type = 'text';
		if (!this.placeholder) this.placeholder = '';
		if (!this.tooltip) this.tooltip = '';
		if (!this.disabled) this.disabled = false;
		if (!this.inputClasses) this.inputClasses = '';
		if (!this.labelClasses) this.labelClasses = '';
		if (!this.multiple) this.multiple = false;
		this.focused = false;
		this.isTyping = false;
	}

	public ngOnInit(): void {
		if (!this.id) this.id = '';
		if (!this.type) this.type = 'text';
		if (!this.placeholder) this.placeholder = '';
		if (!this.tooltip) this.tooltip = '';
		if (!this.disabled) this.disabled = false;
		if (!this.inputClasses) this.inputClasses = '';
		if (!this.labelClasses) this.labelClasses = '';
		if (!this.multiple) this.multiple = false;
		this.focused = false;
		this.isTyping = false;
	}

	public getValue(): string {
		return this.id ? this.parentForm?.get(this.id)?.value : '';
	}

	public onInput(event: Event): void {
		this.isTyping = true;
		this.inputInput.emit(event);
	}

	public onFocus(event: Event): void {
		this.inputFocus.emit(event);
		this.focused = true;
	}

	public onBlur(event: Event): void {
		this.inputFocus.emit(event);
		this.focused = false;
	}

	public onChange(event: Event): void {
		this.inputChange.emit(event);
	}

	public onClick(event: Event): void {
		this.inputClick.emit(event);
	}
}

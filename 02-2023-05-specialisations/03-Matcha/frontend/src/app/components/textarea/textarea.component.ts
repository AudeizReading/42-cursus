import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormControl,
	FormControlDirective,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';

@Component({
	selector: 'app-textarea',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './textarea.component.html',
	styleUrl: './textarea.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: TextareaComponent,
			multi: true,
		},
	],
})
export class TextareaComponent implements ControlValueAccessor {
	@ViewChild(FormControlDirective)
	public formControlDirective!: FormControlDirective;
	@Input() public formControl!: FormControl;
	@Input() public formControlName!: string;
	@Input() public placeholder!: string;
	@Input() public textareaClasses!: string;
	@Input() public labelClasses!: string;
	@Input() public id!: string;

	public constructor(private controlContainer: ControlContainer) {}

	public get control(): FormControl {
		return this.formControl || (this.controlContainer.control?.get(this.formControlName) as FormControl);
	}

	public writeValue(value: string): void {
		if (this.formControlDirective?.valueAccessor) {
			this.formControlDirective.valueAccessor.writeValue(value);
		}
	}

	public registerOnChange(fn: (value: string) => void): void {
		this.formControlDirective?.valueAccessor?.registerOnChange(fn);
	}

	public registerOnTouched(fn: () => void): void {
		this.formControlDirective?.valueAccessor?.registerOnTouched(fn);
	}

	public setDisabledState(isDisabled: boolean): void {
		this.formControlDirective?.valueAccessor?.setDisabledState?.(isDisabled);
	}

	public clear(event: Event): void {
		event.preventDefault();
		this.control.setValue('');
	}
}

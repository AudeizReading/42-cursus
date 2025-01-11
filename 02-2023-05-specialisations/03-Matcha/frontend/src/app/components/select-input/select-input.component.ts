import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-select-input',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './select-input.component.html',
	styleUrl: './select-input.component.scss',
})
export class SelectInputComponent implements OnInit {
	@Input() public parentForm!: FormGroup;
	@Input() public id!: string;
	@Input() public selectClasses!: string;
	@Input() public labelClasses!: string;
	@Input() public options!: string[];
	@Input() public multiple!: boolean;

	public constructor(private formBuilder: FormBuilder) {
		if (!this.id) this.id = '';
		if (!this.selectClasses) this.selectClasses = '';
		if (!this.labelClasses) this.labelClasses = '';
		if (!this.options) this.options = [];
		if (!this.multiple) this.multiple = false;
	}

	public ngOnInit(): void {
		if (!this.id) this.id = '';
		if (!this.selectClasses) this.selectClasses = '';
		if (!this.labelClasses) this.labelClasses = '';
		if (!this.options) this.options = [];
		if (!this.multiple) this.multiple = false;
	}

	public getValue(): string {
		return this.id ? this.parentForm?.get(this.id)?.value : '';
	}
}

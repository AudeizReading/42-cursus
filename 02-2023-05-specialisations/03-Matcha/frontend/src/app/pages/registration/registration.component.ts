import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormSignupComponent, HeaderActionComponent } from '@app/components';
import { LayoutComponent } from '@app/layout';

@Component({
	selector: 'app-registration',
	standalone: true,
	imports: [CommonModule, LayoutComponent, HeaderActionComponent, FormSignupComponent, ReactiveFormsModule],
	templateUrl: './registration.component.html',
	styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
	public isSuccessful: boolean;
	public message: string;

	public constructor() {
		this.isSuccessful = false;
		this.message = '';
	}
	public ngOnInit(): void {
		this.isSuccessful = false;
		this.message = '';
	}

	public onRegister(data: { result: boolean; message: string }): void {
		this.isSuccessful = data.result;
		this.message = data.message;
	}
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PasswordComponent } from '../icons/password/password.component';
import { UsernameComponent } from '../icons/username/username.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmailComponent } from '../icons/email/email.component';
import { DateComponent } from '../icons/date/date.component';
import { EyeComponent } from '../icons/eye/eye.component';

@Component({
	selector: 'app-input-icon',
	standalone: true,
	imports: [UsernameComponent, PasswordComponent, ReactiveFormsModule, EmailComponent, DateComponent, EyeComponent],
	templateUrl: './input-icon.component.html',
	styleUrl: './input-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputIconComponent {
	@Input() public parentForm!: FormGroup;
	@Input() public id!: string;
	@Input() public type!: string;
	@Input() public placeholder!: string;
	@Input() public icon: 'username' | 'password' | 'email' | 'date' | undefined = undefined;
	@Output() public toggleEyeVisibility: EventEmitter<void> = new EventEmitter<void>();

	public onSeePassword(): void {
		this.toggleEyeVisibility.emit();
	}

	protected get autocomplete(): string {
		if (this.compare(this.type, 'password') && this.compare(this._id, 'password')) return 'current-password';
		if (this.compare(this.type, 'password') && this.compare(this._id, 'newpassword')) return 'new-password';
		if (this.compare(this.type, 'password') && this.compare(this._id, 'confirmpassword')) return 'new-password';
		if (this.compare(this.type, 'email')) return 'email';
		if (this.compare(this.type, 'date') && this.compare(this._id, 'birthday')) return 'bday';
		if (this.compare(this.type, 'text') && this._id.includes('username')) return 'username';
		if (this.compare(this.type, 'text') && this._id.includes('firstname')) return 'given-name';
		if (this.compare(this.type, 'text') && this._id.includes('lastname')) return 'family-name';
		return 'on';
	}

	private get _id(): string {
		return this.id.toLowerCase();
	}

	private compare(a: string, b: string): boolean {
		return a === b;
	}
}

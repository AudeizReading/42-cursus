import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailValidationComponent } from './email-validation.component';

describe('EmailValidationComponent', () => {
	let component: EmailValidationComponent;
	let fixture: ComponentFixture<EmailValidationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EmailValidationComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EmailValidationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

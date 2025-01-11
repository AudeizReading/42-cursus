import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSignupComponent } from './form-signup.component';

describe('FormSignupComponent', () => {
	let component: FormSignupComponent;
	let fixture: ComponentFixture<FormSignupComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormSignupComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FormSignupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

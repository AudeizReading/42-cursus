import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameComponent } from './username.component';

describe('UsernameComponent', () => {
	let component: UsernameComponent;
	let fixture: ComponentFixture<UsernameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UsernameComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UsernameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

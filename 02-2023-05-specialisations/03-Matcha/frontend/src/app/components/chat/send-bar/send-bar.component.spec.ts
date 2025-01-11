import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBarComponent } from './send-bar.component';

describe('SendBarComponent', () => {
	let component: SendBarComponent;
	let fixture: ComponentFixture<SendBarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SendBarComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SendBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

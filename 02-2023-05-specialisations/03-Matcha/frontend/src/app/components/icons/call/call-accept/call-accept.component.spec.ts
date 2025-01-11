import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallAcceptComponent } from './call-accept.component';

describe('CallAcceptComponent', () => {
	let component: CallAcceptComponent;
	let fixture: ComponentFixture<CallAcceptComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CallAcceptComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CallAcceptComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

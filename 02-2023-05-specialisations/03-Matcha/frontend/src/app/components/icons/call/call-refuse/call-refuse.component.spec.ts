import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRefuseComponent } from './call-refuse.component';

describe('CallRefuseComponent', () => {
	let component: CallRefuseComponent;
	let fixture: ComponentFixture<CallRefuseComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CallRefuseComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CallRefuseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

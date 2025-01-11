import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeComponent } from './eye.component';

describe('EyeComponent', () => {
	let component: EyeComponent;
	let fixture: ComponentFixture<EyeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EyeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EyeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

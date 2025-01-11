import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossComponent } from './cross.component';

describe('CrossComponent', () => {
	let component: CrossComponent;
	let fixture: ComponentFixture<CrossComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CrossComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CrossComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

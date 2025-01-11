import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderComponent } from './gender.component';

describe('GenderComponent', () => {
	let component: GenderComponent;
	let fixture: ComponentFixture<GenderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GenderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GenderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

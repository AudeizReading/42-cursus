import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdleComponent } from './idle.component';

describe('IdleComponent', () => {
	let component: IdleComponent;
	let fixture: ComponentFixture<IdleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IdleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IdleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

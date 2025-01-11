import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterActionComponent } from './footer-action.component';

describe('FooterActionComponent', () => {
	let component: FooterActionComponent;
	let fixture: ComponentFixture<FooterActionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FooterActionComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FooterActionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

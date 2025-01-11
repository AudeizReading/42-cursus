import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBrowsingComponent } from './card-browsing.component';

describe('CardBrowsingComponent', () => {
	let component: CardBrowsingComponent;
	let fixture: ComponentFixture<CardBrowsingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardBrowsingComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardBrowsingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

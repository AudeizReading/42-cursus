import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderActionComponent } from './header-action.component';

describe('HeaderActionComponent', () => {
	let component: HeaderActionComponent;
	let fixture: ComponentFixture<HeaderActionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HeaderActionComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(HeaderActionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

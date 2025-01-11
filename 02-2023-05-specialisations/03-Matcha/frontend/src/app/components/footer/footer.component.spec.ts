import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@app/components/button/button.component';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
	let component: FooterComponent;
	let fixture: ComponentFixture<FooterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CommonModule, FooterComponent, ButtonComponent],
			declarations: [],
		}).compileComponents();

		fixture = TestBed.createComponent(FooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have default footer classes', () => {
		expect(component.footerClasses).toBe('footer-home');
	});

	it('should have default button classes', () => {
		expect(component.btnClasses).toBe('btn-primary');
	});

	it('should have default link', () => {
		expect(component.link).toBe('/');
	});
});

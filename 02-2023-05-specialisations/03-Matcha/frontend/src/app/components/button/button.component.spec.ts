import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
	let component: ButtonComponent;
	let fixture: ComponentFixture<ButtonComponent>;
	let routerSpy: { navigateByUrl: jasmine.Spy };

	beforeEach(async () => {
		routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
		await TestBed.configureTestingModule({
			imports: [ButtonComponent],
			providers: [{ provide: Router, useValue: routerSpy }],
			declarations: [],
		}).compileComponents();

		fixture = TestBed.createComponent(ButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have default values', () => {
		expect(component.disabled).toBeFalse();
		expect(component.type).toBe('button');
		expect(component.variant).toBe('primary');
		expect(component.btnClasses).toBe('btn-primary');
		expect(component.link).toBe('/');
		expect(component.icon).toBeNull();
	});

	it('should navigate to the specified link when clicked', () => {
		component.link = '/';
		component.onClick();
		expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
	});

	it('should not navigate when disabled', () => {
		component.disabled = true;
		component.onClick();
		expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
	});
});

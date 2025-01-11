import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HeaderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		const expectedClasses = 'class1 class2';
		component.headerClasses = expectedClasses;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have the correct header classes', () => {
		fixture.detectChanges();
		const headerElement = fixture.nativeElement.querySelector('header');
		expect(headerElement.classList).toContain('class1');
		expect(headerElement.classList).toContain('class2');
	});
});

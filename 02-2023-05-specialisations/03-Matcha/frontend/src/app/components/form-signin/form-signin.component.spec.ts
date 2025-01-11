import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormSigninComponent } from './form-signin.component';

describe('FormSigninComponent', () => {
	let component: FormSigninComponent;
	let fixture: ComponentFixture<FormSigninComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, FormSigninComponent],
			declarations: [],
		}).compileComponents();

		fixture = TestBed.createComponent(FormSigninComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize the signinForm with default values', () => {
		expect(component.signinForm.get('username')?.value).toEqual('');
		expect(component.signinForm.get('password')?.value).toEqual('');
		expect(component.signinForm.get('rememberMe')?.value).toEqual(false);
		expect(component.signinForm.get('signin')?.value).toEqual('Sign In');
	});

	it('should disable the signin button initially', () => {
		expect(component.signinForm.get('signin')?.disabled).toBeTrue();
	});

	it('should enable the signin button when the form is valid and dirty', fakeAsync(() => {
		const updateButtonStateSpy = spyOn<FormSigninComponent, keyof FormSigninComponent>(
			FormSigninComponent.prototype,
			'updateButtonState' as never,
		).and.callThrough();
		component.signinForm.get('username')?.setValue('testuser');
		component.signinForm.get('password')?.setValue('testpassword1234');
		component.signinForm.markAsDirty();
		tick();
		fixture.detectChanges();
		expect(updateButtonStateSpy).toHaveBeenCalled();
		expect(component.signinForm.get('signin')?.disabled).toBeTrue();
	}));

	it('should disable the signin button when the form is invalid or not dirty', () => {
		const updateButtonStateSpy = spyOn<FormSigninComponent, keyof FormSigninComponent>(
			FormSigninComponent.prototype,
			'updateButtonState' as never,
		).and.callThrough();
		component.signinForm.get('username')?.setValue('');
		component.signinForm.get('password')?.setValue('');
		component.signinForm.markAsPristine();
		component.ngOnInit();
		expect(updateButtonStateSpy).toHaveBeenCalled();
		expect(component.signinForm.get('signin')?.disabled).toBeTrue();
	});

	it('should call onSubmit method when the form is submitted', () => {
		spyOn(component, 'onSubmit');
		const form = component.signinForm;
		component.onSubmit(form);
		expect(component.onSubmit).toHaveBeenCalledWith(form);
	});
});

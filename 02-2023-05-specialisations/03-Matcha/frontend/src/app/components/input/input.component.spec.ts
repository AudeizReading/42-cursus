import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
	let component: InputComponent;
	let fixture: ComponentFixture<InputComponent>;
	let formBuilder: FormBuilder;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, InputComponent],
		}).compileComponents();

		formBuilder = TestBed.inject(FormBuilder);
		fixture = TestBed.createComponent(InputComponent);
		component = fixture.componentInstance;
		component.parentForm = formBuilder.group({
			testInput: '',
		});
		component.id = 'testInput';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should return the correct value from parent form', () => {
		component.parentForm.patchValue({
			testInput: 'Test Value',
		});
		expect(component.getValue()).toEqual('Test Value');
	});
});

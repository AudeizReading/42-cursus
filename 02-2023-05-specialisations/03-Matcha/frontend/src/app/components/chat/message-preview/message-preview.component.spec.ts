import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePreviewComponent } from './message-preview.component';

describe('MessagePreviewComponent', () => {
	let component: MessagePreviewComponent;
	let fixture: ComponentFixture<MessagePreviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MessagePreviewComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MessagePreviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

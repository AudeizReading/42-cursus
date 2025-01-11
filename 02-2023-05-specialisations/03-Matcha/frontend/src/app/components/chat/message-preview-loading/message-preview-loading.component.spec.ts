import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePreviewLoadingComponent } from './message-preview-loading.component';

describe('MessagePreviewLoadingComponent', () => {
	let component: MessagePreviewLoadingComponent;
	let fixture: ComponentFixture<MessagePreviewLoadingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MessagePreviewLoadingComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MessagePreviewLoadingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

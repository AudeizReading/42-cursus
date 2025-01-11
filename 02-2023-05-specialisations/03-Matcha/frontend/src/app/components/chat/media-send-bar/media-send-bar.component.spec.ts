import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaSendBarComponent } from './media-send-bar.component';

describe('MediaSendBarComponent', () => {
	let component: MediaSendBarComponent;
	let fixture: ComponentFixture<MediaSendBarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MediaSendBarComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MediaSendBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

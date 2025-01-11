import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthLinkComponent } from './oauth-link.component';

describe('OauthLinkComponent', () => {
	let component: OauthLinkComponent;
	let fixture: ComponentFixture<OauthLinkComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OauthLinkComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(OauthLinkComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarBrowsingComponent } from './search-bar-browsing.component';

describe('SearchBarBrowsingComponent', () => {
	let component: SearchBarBrowsingComponent;
	let fixture: ComponentFixture<SearchBarBrowsingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SearchBarBrowsingComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SearchBarBrowsingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

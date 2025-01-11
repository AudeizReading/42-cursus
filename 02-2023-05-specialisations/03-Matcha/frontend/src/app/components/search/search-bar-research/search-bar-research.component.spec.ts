import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarResearchComponent } from './search-bar-research.component';

describe('SearchBarResearchComponent', () => {
	let component: SearchBarResearchComponent;
	let fixture: ComponentFixture<SearchBarResearchComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SearchBarResearchComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SearchBarResearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

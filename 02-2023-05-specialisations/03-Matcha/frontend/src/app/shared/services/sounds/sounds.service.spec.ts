import { TestBed } from '@angular/core/testing';

import { SoundsService } from './sounds.service';

describe('SoundsService', () => {
	let service: SoundsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SoundsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiService, LoggerService } from '@app/shared';
import { GendersDTO } from '@app/models';

@Injectable({
	providedIn: 'root',
})
export class GenderService {
	public constructor(
		private logger: LoggerService,
		private apiService: ApiService,
	) {}

	public getGenders(): Observable<unknown> {
		try {
			return this.apiService.get('v1.gender.endpoint');
		} catch (error) {
			this.logger.handleError<GendersDTO>('get genders');
		}
		return of(null);
	}
}

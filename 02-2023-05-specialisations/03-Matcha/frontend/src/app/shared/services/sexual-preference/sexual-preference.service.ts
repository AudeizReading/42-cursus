import { Injectable } from '@angular/core';
import { SexualPreferencesDTO } from '@app/models';
import { ApiService, LoggerService } from '@app/shared';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SexualPreferenceService {
	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
	) {}

	public getSexualPreferences(): Observable<SexualPreferencesDTO> {
		try {
			return this.apiService.get('v1.sexual-preference.endpoint') as Observable<SexualPreferencesDTO>;
		} catch (error) {
			this.logger.handleError<SexualPreferencesDTO>('v1.sexual-preference.endpoint');
		}
		return of(null) as unknown as Observable<SexualPreferencesDTO>;
	}
}

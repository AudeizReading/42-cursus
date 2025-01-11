import { Injectable } from '@angular/core';
import { AccessTokenDTO, ApiQuery, EmailRecoveryBodyDTO } from '@app/models';
import { ApiService, LoggerService } from '@app/shared';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class EmailValidationService {
	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
	) {}

	public getValidation(token: string): Observable<AccessTokenDTO> {
		try {
			return this.apiService.get(`v1.email.validate.endpoint`, { params: token }) as Observable<AccessTokenDTO>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('v1.email.validate.endpoint', { params: token });
		}
		return of(null) as unknown as Observable<AccessTokenDTO>;
	}

	public recovery(email: string): Observable<unknown> {
		try {
			return this.apiService.post<ApiQuery, EmailRecoveryBodyDTO>(`v1.email.send.recovery`, { body: { email } });
		} catch (error) {
			this.logger.handleError<{ body: string }>('v1.email.send.recovery', { body: email });
		}
		return of({ body: { email } });
	}
}

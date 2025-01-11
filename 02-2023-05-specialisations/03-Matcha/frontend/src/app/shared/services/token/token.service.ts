import { Injectable } from '@angular/core';
import { ValidityTokenDTO } from '@app/models';
import { ApiService, LoggerService } from '@app/shared';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TokenService {
	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
	) {}

	public isValid(token: string): Observable<ValidityTokenDTO> {
		try {
			return this.apiService.get(`v1.token.endpoint`, { params: token }) as Observable<ValidityTokenDTO>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('token.endpoint', { params: token });
		}
		return of(null) as unknown as Observable<ValidityTokenDTO>;
	}
}

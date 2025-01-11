import { Injectable } from '@angular/core';
import { LoggerService } from '@app/shared/logger';
import { ApiService } from '..';
import { Observable, of } from 'rxjs';
import { ApiBody, IUsersBlocked, UserMatchQueryDTO } from '@app/models';

@Injectable({
	providedIn: 'root',
})
export class BlockService {
	public constructor(
		private logger: LoggerService,
		private apiService: ApiService,
	) {}

	public getBlocked(limit: number = 5, page: number = 0): Observable<IUsersBlocked> {
		try {
			return this.apiService.get<UserMatchQueryDTO, ApiBody>('v1.block.endpoint', {
				query: { limit, page },
			}) as Observable<IUsersBlocked>;
		} catch (error) {
			this.logger.handleError<IUsersBlocked>(`blocked ${{ query: { limit, page } }}`);
		}
		return of({}) as Observable<IUsersBlocked>;
	}
}

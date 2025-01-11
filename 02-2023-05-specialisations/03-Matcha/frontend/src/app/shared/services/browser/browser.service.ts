import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiBody } from '@app/models';
import { BrowserApiBodyDTO, BrowserApiQueryDTO, BrowserApiResponseDTO } from '@app/models/browser';
import { ApiService, LoggerService } from '@app/shared';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class BrowserService {
	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
	) {}

	public search(query: BrowserApiQueryDTO, body: BrowserApiBodyDTO): Observable<HttpResponse<BrowserApiResponseDTO>> {
		{
			try {
				return this.apiService.post<BrowserApiQueryDTO, BrowserApiBodyDTO>(`v1.browsing.search`, {
					query,
					body,
				}) as Observable<HttpResponse<BrowserApiResponseDTO>>;
			} catch (error) {
				this.logger.handleError<{
					query: BrowserApiQueryDTO;
					body: BrowserApiBodyDTO;
				}>(`v1.browsing.search`);
			}
			return of(null) as unknown as Observable<HttpResponse<BrowserApiResponseDTO>>;
		}
	}

	public browse(query: BrowserApiQueryDTO): Observable<BrowserApiResponseDTO> {
		try {
			return this.apiService.get<BrowserApiQueryDTO, ApiBody>(`v1.browsing.endpoint`, {
				query,
			}) as Observable<BrowserApiResponseDTO>;
		} catch (error) {
			this.logger.handleError<{
				query: BrowserApiQueryDTO;
			}>(`v1.browsing.endpoint`, {
				query,
			});
		}
		return of(null) as unknown as Observable<BrowserApiResponseDTO>;
	}
}

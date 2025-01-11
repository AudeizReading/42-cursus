import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiQuery, EventBodyDTO, EventResponseDTO, EventsResponseDTO, FileDTO } from '@app/models';
import { ApiService, LoggerService } from '@app/shared';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class EventService {
	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
	) {}

	public postEventFile(file: File): Observable<HttpResponse<FileDTO>> {
		{
			try {
				const formData = new FormData();
				formData.append('file', file, file.name);

				return this.apiService.post<ApiQuery, FormData>(`v1.file.event`, {
					body: formData,
				}) as Observable<HttpResponse<FileDTO>>;
			} catch (error) {
				this.logger.handleError<{
					body: string;
				}>(`v1.file.event`, {
					body: file.name,
				});
			}
			return of(null) as unknown as Observable<HttpResponse<FileDTO>>;
		}
	}

	public postEvent(event: EventBodyDTO): Observable<HttpResponse<EventResponseDTO>> {
		{
			try {
				return this.apiService.post<ApiQuery, EventBodyDTO>(`v1.event.endpoint`, {
					body: event,
				}) as Observable<HttpResponse<EventResponseDTO>>;
			} catch (error) {
				this.logger.handleError<{
					body: EventBodyDTO;
				}>(`v1.event.endpoint`, {
					body: event,
				});
			}
			return of(null) as unknown as Observable<HttpResponse<EventResponseDTO>>;
		}
	}

	public getEvent(limit: number = 5, page: number = 0): Observable<EventsResponseDTO> {
		{
			try {
				return this.apiService.get<ApiQuery, EventBodyDTO>(`v1.event.endpoint`, {
					query: { limit, page },
				}) as Observable<EventsResponseDTO>;
			} catch (error) {
				this.logger.handleError<{
					query: { limit: number; page: number };
				}>(`v1.event.endpoint`, {
					query: { limit, page },
				});
			}
			return of(null) as unknown as Observable<EventsResponseDTO>;
		}
	}

	public answerEvent(idEvent: string, action: 'accept' | 'refuse'): Observable<HttpResponse<EventResponseDTO>> {
		{
			try {
				return this.apiService.put<ApiQuery, EventBodyDTO>(`v1.event.id.${action}`, {
					params: `${idEvent}/${action}/`,
				}) as Observable<HttpResponse<EventResponseDTO>>;
			} catch (error) {
				this.logger.handleError<{
					params: string;
				}>(`v1.event.id.${action}`, {
					params: `${idEvent}/${action}/`,
				});
			}
			return of(null) as unknown as Observable<HttpResponse<EventResponseDTO>>;
		}
	}
}

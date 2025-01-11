import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TagsDTO, TagDTO, TagQueryDTO, TagBodyDTO } from '@app/models';
import { ApiService, LoggerService } from '@app/shared';
import { map, Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TagService {
	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
	) {}

	public getTags({ limit = 5, page = 0, search = '' }: TagQueryDTO): Observable<TagsDTO> {
		try {
			if (search.length > 0) {
				return this.apiService.get<TagQueryDTO, TagBodyDTO>('v1.tag.endpoint', {
					query: { limit, page, search },
				}) as Observable<TagsDTO>;
			}
			return this.apiService.get<TagQueryDTO, TagBodyDTO>('v1.tag.endpoint', {
				query: { limit, page },
			}) as Observable<TagsDTO>;
		} catch (error) {
			this.logger.handleError<unknown>('v1.tag.endpoint', { query: { limit, page, search } });
		}
		return of({ query: { limit, page, search } }) as unknown as Observable<TagsDTO>;
	}

	public createTag(tag: string): Observable<TagDTO> {
		try {
			return this.apiService
				.post<TagQueryDTO, TagBodyDTO>('v1.tag.endpoint', {
					body: { tag: tag },
				})
				.pipe(
					map((payload) => (payload as unknown as HttpResponse<TagDTO>).body as unknown as TagDTO),
				) as Observable<TagDTO>;
		} catch (error) {
			this.logger.handleError<unknown>(`v1.tag.endpoint`, { body: { tag: tag } });
		}
		return of({ body: tag }) as unknown as Observable<TagDTO>;
	}

	public deleteTag(tag: string): Observable<TagDTO> {
		try {
			return this.apiService.delete<TagQueryDTO, TagBodyDTO>('v1.tag.endpoint', {
				body: { tag: tag },
			}) as Observable<TagDTO>;
		} catch (error) {
			this.logger.handleError<unknown>(`v1.tag.endpoint`, { body: { tag: tag } });
		}
		return of({ body: tag }) as unknown as Observable<TagDTO>;
	}
}

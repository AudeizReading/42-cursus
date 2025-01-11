import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiQuery, FileDTO } from '@app/models';
import { ApiService, LoggerService } from '@app/shared';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FileService {
	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
	) {}

	public getFile(uuid: string): Observable<unknown> {
		try {
			return this.apiService.get('v1.file.endpoint', { params: uuid }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('v1.file.endpoint', { params: uuid });
		}
		return of(null) as unknown as Observable<unknown>;
	}

	public deleteFile(uuid: string): Observable<unknown> {
		try {
			return this.apiService.delete('v1.file.endpoint', { params: uuid }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('v1.file.endpoint', { params: uuid });
		}
		return of(null) as unknown as Observable<unknown>;
	}

	public getFileInfo(uuid: string): Observable<FileDTO> {
		try {
			return this.apiService.get('v1.file.info', { params: uuid }) as Observable<FileDTO>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('v1.file.info', { params: uuid });
		}
		return of(null) as unknown as Observable<FileDTO>;
	}

	public deleteFileId(uuid: string): Observable<unknown> {
		try {
			return this.apiService.delete('v1.file.id', { params: uuid }) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<{ params: string }>('v1.file.id', { params: uuid });
		}
		return of(null) as unknown as Observable<unknown>;
	}

	public addFileToProfile(file: FormData): Observable<FileDTO | HttpResponse<unknown> | HttpEvent<unknown>> {
		try {
			return this.apiService.post<ApiQuery, FormData>('v1.file.profile', {
				body: file,
				reportProgress: true,
			}) as Observable<FileDTO | HttpResponse<unknown> | HttpEvent<unknown>>;
		} catch (error) {
			this.logger.handleError<{ body: FormData }>('v1.file.profile', { body: file });
		}
		return of(null) as unknown as Observable<FileDTO>;
	}
}

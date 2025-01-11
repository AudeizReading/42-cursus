import { Injectable } from '@angular/core';
import { FacebookBooleanCursors, FacebookCursors, FacebookPictureResponseDTO } from '@app/models';
import { ApiService, LoggerService } from '@app/shared';
import { forkJoin, Observable, of, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FacebookService {
	private cursors?: FacebookCursors;

	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
	) {}

	public get fbCursors(): FacebookBooleanCursors {
		return {
			before: !!this.cursors?.before,
			after: !!this.cursors?.after,
		};
	}

	public getRight(): Observable<unknown> {
		try {
			return this.apiService.get('v1.picture-facebook.right') as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<null>('v1.picture-facebook.right', null);
		}
		return of({}) as Observable<unknown>;
	}

	public getPicture(): Observable<FacebookPictureResponseDTO> {
		try {
			return (
				this.apiService.get('v1.picture-facebook.picture.endpoint') as Observable<FacebookPictureResponseDTO>
			).pipe(
				tap((payload) => {
					this.cursors = { ...payload.cursors };
				}),
			);
		} catch (error) {
			this.logger.handleError<null>('v1.picture-facebook.picture.endpoint', null);
		}
		return of({}) as Observable<FacebookPictureResponseDTO>;
	}

	public convertPicturesToFiles(payload: FacebookPictureResponseDTO): Observable<File[]> {
		try {
			const fileObservables = payload.data.flatMap((data, i) => {
				return this.apiService.getUrlToFile(data.images[0].source, data.id + '---' + i);
			});
			return forkJoin(fileObservables);
		} catch (error) {
			this.logger.handleError<null>('v1.picture-facebook.picture.endpoint', null);
		}
		return of([]);
	}

	public getBeforePicture(): Observable<FacebookPictureResponseDTO> {
		try {
			if (this.cursors?.before) {
				return (
					this.apiService.get('v1.picture-facebook.picture.before', {
						params: this.cursors.before,
					}) as Observable<FacebookPictureResponseDTO>
				).pipe(
					tap((payload) => {
						this.cursors = { ...payload.cursors };
					}),
				);
			} else {
				throw new Error('No before cursor');
			}
		} catch (error) {
			this.logger.handleError<{
				params: string;
			}>('v1.picture-facebook.picture.before', { params: this.cursors?.before ?? '' });
		}
		return of({}) as Observable<FacebookPictureResponseDTO>;
	}

	public getAfterPicture(): Observable<FacebookPictureResponseDTO> {
		try {
			if (this.cursors?.after) {
				return (
					this.apiService.get('v1.picture-facebook.picture.after', {
						params: this.cursors.after,
					}) as Observable<FacebookPictureResponseDTO>
				).pipe(
					tap((payload) => {
						this.cursors = { ...payload.cursors };
					}),
				);
			} else {
				throw new Error('No after cursor');
			}
		} catch (error) {
			this.logger.handleError<{
				params: string;
			}>('v1.picture-facebook.picture.after', { params: this.cursors?.after ?? '' });
		}
		return of({}) as Observable<FacebookPictureResponseDTO>;
	}

	public putPicture(idPictureFb: string): Observable<FacebookPictureResponseDTO> {
		try {
			return this.apiService.put('v1.picture-facebook.id', {
				params: idPictureFb,
			}) as Observable<FacebookPictureResponseDTO>;
		} catch (error) {
			this.logger.handleError<{
				params: string;
			}>('v1.picture-facebook.id', { params: idPictureFb });
		}
		return of({}) as Observable<FacebookPictureResponseDTO>;
	}
}

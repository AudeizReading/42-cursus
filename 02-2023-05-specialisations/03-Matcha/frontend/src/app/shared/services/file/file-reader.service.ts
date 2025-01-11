import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilePreview } from '@app/models';
import { Observable, Subject, map, switchMap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FileReaderService {
	private mimeTypes: string[];
	private fileSubject = new Subject<FilePreview>();
	private destroyRef: DestroyRef = inject(DestroyRef);
	public constructor() {
		// https://en.wikipedia.org/wiki/List_of_file_signatures
		this.mimeTypes = [
			'FFD8FFE0',
			'FFD8FFDB',
			'FFD8FFEE',
			'FFD8FFE1',
			'FFD8FFE2',
			'89504E47',
			'52494646',
			'57454250',
		];
	}

	private getMimeType(buffer: ArrayBuffer): string {
		if (buffer.byteLength < 4) {
			return 'INVALID';
		}
		return Array.from(new Uint8Array(buffer.slice(0, 4)))
			.map((byte) => byte.toString(16).toUpperCase())
			.join('');
	}

	private readFileAsDataURL(file: File): Observable<string | null | ArrayBuffer> {
		return new Observable((observer) => {
			const reader = new FileReader();
			reader.onload = (): void => {
				observer.next(reader.result);
				observer.complete();
			};
			reader.onerror = (): void => {
				observer.error(reader.result);
			};
			reader.readAsDataURL(file);
		});
	}

	private readFileAsBinaryString(file: File): Observable<string | null | ArrayBuffer> {
		return new Observable((observer) => {
			const reader = new FileReader();
			reader.onload = (e): void => {
				if (!e || !e.target || !e.target.result) {
					observer.error(null);
					return;
				}
				const arrayBuffer = e.target.result as ArrayBuffer;
				const mimeType = this.getMimeType(arrayBuffer);
				if (this.mimeTypes.includes(mimeType)) {
					observer.next(arrayBuffer);
					observer.complete();
				} else {
					observer.error(`${mimeType} is not a valid image type`);
				}
			};
			reader.onerror = (): void => {
				observer.error(reader.result);
			};
			reader.readAsArrayBuffer(file);
		});
	}

	public getFilePreview(file: File): Observable<FilePreview> {
		return this.readFileAsBinaryString(file).pipe(
			switchMap(() => this.readFileAsDataURL(file)),
			map(
				(data) =>
					new FilePreview({
						name: file.name,
						url: URL.createObjectURL(file),
						preview: data,
						size: file.size,
						type: file.type,
					}),
			),
		);
	}

	public dispatch(file: File): void {
		this.getFilePreview(file)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (preview) => {
					this.fileSubject.next(preview);
				},
				error: (err) => {
					this.fileSubject.error(err);
				},
			});
	}

	public onFile(file: File): Observable<FilePreview> {
		return this.fileSubject.asObservable().pipe(switchMap(() => this.getFilePreview(file)));
	}
}

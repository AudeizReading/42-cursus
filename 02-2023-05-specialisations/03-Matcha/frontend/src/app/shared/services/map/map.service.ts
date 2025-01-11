import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, switchMap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class LazyLeafletService {
	private leafletPromise: Promise<typeof import('leaflet')>;

	public constructor(@Inject(PLATFORM_ID) private platformId: object) {
		this.leafletPromise = new Promise((resolve, reject) => {
			if (isPlatformBrowser(this.platformId)) {
				import('leaflet')
					.then((leaflet) => {
						if (leaflet.map !== undefined) {
							resolve(leaflet);
						} else {
							resolve((leaflet as unknown as { [key: string]: any })['default']);
						}
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				reject(new Error('Not running in a browser'));
			}
		});
	}

	public getLeaflet(): Promise<typeof import('leaflet')> {
		return this.leafletPromise;
	}
}

@Injectable({
	providedIn: 'root',
})
export class MapService {
	public constructor(private lazyLeafletService: LazyLeafletService) {}

	public getMap(): Observable<typeof import('leaflet')> {
		return from(this.lazyLeafletService.getLeaflet()).pipe(
			switchMap((leaflet) => {
				return new Observable<typeof import('leaflet')>((observer) => {
					observer.next(leaflet);
					observer.complete();

					return () => {};
				});
			}),
		);
	}
}

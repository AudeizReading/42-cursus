import { Injectable } from '@angular/core';
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HTTP_INTERCEPTORS,
	HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService, StorageService } from '@app/shared';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
	public constructor(
		private storage: StorageService,
		private apiService: ApiService,
	) {}

	public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const token: string = (this.storage.isAuth() && this.storage.getUser<string>()) || '';
		let headers: HttpHeaders = req.headers;
		if (!req.url.includes('.xx.fbcdn.net') && !(req.body instanceof FormData)) {
			headers = headers.set('Content-Type', 'application/json');
		}
		if (!req.url.includes('.xx.fbcdn.net') && this.apiService.needAuth(req.url, req.method) && token?.length > 0) {
			headers = headers.set('Authorization', `Bearer ${token}`);
		}
		const clone: HttpRequest<unknown> = req.clone({ headers });

		return next.handle(clone);
	}
}

export const httpInterceptorProviders = [
	{
		provide: HTTP_INTERCEPTORS,
		useClass: HttpRequestInterceptor,
		multi: true,
	},
];

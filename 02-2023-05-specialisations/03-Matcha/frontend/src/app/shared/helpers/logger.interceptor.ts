import { Injectable } from '@angular/core';
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HTTP_INTERCEPTORS,
	HttpErrorResponse,
	HttpResponse,
	HttpEventType,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { LogType, LoggerService } from '@app/shared';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
	public constructor(private logger: LoggerService) {}

	public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		let msg = ` <${req.method} - ${req.url}>`;
		let type = 'INFO' as LogType;
		return next.handle(req).pipe(
			tap({
				next: (_) => (msg = this.parseResponse(_) + msg),
				error: (error) => {
					msg = this.parseResponse(error) + msg;
					type = 'ERROR' as LogType;
				},
				finalize: () => this.logger.log(msg, type),
			}),
		);
	}

	private parseResponse(res: HttpEvent<unknown | HttpResponse<unknown> | HttpErrorResponse>): string {
		let status: number;
		let statusText: string;
		let ok: boolean = false;
		let _: string = '';

		if (res.type === HttpEventType.Response || res instanceof HttpErrorResponse) {
			const response = res as HttpResponse<unknown>;
			status = response.status;
			statusText = response.statusText;
			ok = response.ok;

			_ = `${ok ? 'Success: ' : 'Fail: '}${status} - ${statusText}`;
		} else if (res.type === HttpEventType.Sent) {
			// Le type est HttpSentEvent, il n'y a pas de réponse HTTP
			// Vous pouvez gérer cela en conséquence, par exemple, en définissant des valeurs par défaut
			statusText = 'Request sent';
			_ = ` - ${statusText}`;
		} else {
			// Si l'événement HTTP n'est ni une réponse ni un envoi, vous pouvez gérer cela comme nécessaire
			// Par exemple, vous pouvez gérer les événements de téléchargement ou d'envoi de progression ici
			statusText = '';
		}

		const msg = `${_}`;
		return msg;
	}
}

export const loggingInterceptorProviders = [
	{
		provide: HTTP_INTERCEPTORS,
		useClass: LoggingInterceptor,
		multi: true,
	},
];

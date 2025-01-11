import { Injectable } from '@angular/core';
import { Alert, AlertType } from '@app/models';
import { Observable, Subject, filter } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AlertService {
	private subject = new Subject<Alert>();
	private defaultId = 'default-alert';

	public constructor() {}

	// enable subscribing to alerts observable
	public onAlert(id = this.defaultId): Observable<Alert> {
		return this.subject.asObservable().pipe(filter((x) => x && x.id === id));
	}

	private alert(alert: Alert): void {
		alert.id = alert.id || this.defaultId;
		this.subject.next(alert);
	}

	public success(message: string, options?: Partial<Alert>): void {
		this.alert(new Alert({ ...options, type: AlertType.Success, message }));
	}

	public info(message: string, options?: Partial<Alert>): void {
		this.alert(new Alert({ ...options, type: AlertType.Info, message }));
	}

	public warn(message: string, options?: Partial<Alert>): void {
		this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
	}

	public error(message: string, options?: Partial<Alert>): void {
		this.alert(new Alert({ ...options, type: AlertType.Error, message }));
	}

	public clear(id = this.defaultId): void {
		this.subject.next(new Alert({ id }));
	}
}

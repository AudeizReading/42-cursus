import { AlertService } from '@app/shared';

/* eslint-disable @typescript-eslint/naming-convention */
export class Alert {
	public type?: AlertType;
	public message?: string;
	public label?: string;
	public autoClose?: boolean;
	public keepAfterRouteChange?: boolean;
	public fade?: boolean;
	public id?: string;
	public open?: boolean;
	public action?: () => void;

	public constructor(init?: Partial<Alert>) {
		Object.assign(this, init);
	}
}

export enum AlertType {
	Success = 'SUCCESS',
	Error = 'ERROR',
	Info = 'ACTION',
	Warning = 'WARN',
}

export type AlertTypeString = 'success' | 'error' | 'info' | 'warn';

export class AlertFacade {
	public constructor(private alertService: AlertService) {}

	protected alert(
		type: AlertTypeString,
		message: string,
		opts: Partial<Alert> = {
			keepAfterRouteChange: true,
			autoClose: true,
			fade: true,
			open: true,
		},
	): void {
		switch (type) {
			case 'error':
				this.alertService.error(message, opts);
				break;
			case 'success':
				this.alertService.success(message, opts);
				break;
			case 'info':
				this.alertService.info(message, opts);
				break;
			case 'warn':
				this.alertService.warn(message, opts);
				break;
		}
	}
}

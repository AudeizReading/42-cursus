import { Injectable, isDevMode } from '@angular/core';
import { Log, LogType } from './log';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class LoggerService {
	private logs: Log[] = [];
	public constructor() {}

	public add(message: string, type: LogType): void {
		this.logs.push({ type, timestamp: new Date(), value: message });
	}

	public clear(): void {
		this.logs = [];
	}

	public getAll(): Log[] {
		return this.logs;
	}

	public handleError<T>(operation = 'operation', result?: T): (error: unknown) => Observable<T> {
		return (error: unknown): Observable<T> => {
			this.log(`${operation} failed: ${(error as { message: string }).message}`, 'ERROR' as LogType);
			return of(result as T);
		};
	}

	public log(message: unknown, type: LogType): void {
		if (isDevMode()) {
			const log: string = `${JSON.stringify(message)}`;
			this.add(log, type);
			const all = this.getAll();
			switch (type) {
				case 'ERROR':
					console.error(log, all);
					break;
				case 'INFO':
					console.log(log, all);
					break;
				case 'WARN':
					console.warn(log, all);
					break;
				case 'DEBUG':
					console.debug(log, all);
					break;
			}
		}
	}
}

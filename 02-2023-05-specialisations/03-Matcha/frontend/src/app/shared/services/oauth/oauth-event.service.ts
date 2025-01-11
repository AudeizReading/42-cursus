import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, share } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class OauthEventService {
	public constructor() {}

	private oauthReceivedSubject = new Subject<unknown>();
	// share -> pour multicast l'observable: permet de suscribe l'event a plusieurs endroits du code
	public oauthReceived$ = this.oauthReceivedSubject.asObservable().pipe(
		share({
			connector: () => new ReplaySubject(1), // bufferize last message
		}),
	);

	private oauthDestroyedSubject = new Subject<boolean>();
	public oauthDestroyed$ = this.oauthDestroyedSubject.asObservable().pipe(
		share({
			connector: () => new ReplaySubject(1), // bufferize last message
		}),
	);

	public emitOauthReceived(datas: unknown): void {
		this.oauthReceivedSubject.next(datas);
	}

	public emitOauthDestroyed(token: boolean): void {
		this.oauthDestroyedSubject.next(token);
	}
}

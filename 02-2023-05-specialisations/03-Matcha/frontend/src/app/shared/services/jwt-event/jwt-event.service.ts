import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, share } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class JwtEventService {
	private jwtReceivedSubject = new Subject<string>();
	// share -> pour multicast l'observable: permet de suscribe l'event a plusieurs endroits du code
	public jwtReceived$ = this.jwtReceivedSubject.asObservable().pipe(
		share({
			connector: () => new ReplaySubject(1), // bufferize last message
		}),
	);

	private jwtDestroyedSubject = new Subject<boolean>();
	public jwtDestroyed$ = this.jwtDestroyedSubject.asObservable().pipe(
		share({
			connector: () => new ReplaySubject(1), // bufferize last message
		}),
	);

	public emitJwtReceived(token: string): void {
		this.jwtReceivedSubject.next(token);
	}

	public emitJwtDestroyed(token: boolean): void {
		this.jwtDestroyedSubject.next(token);
	}
}

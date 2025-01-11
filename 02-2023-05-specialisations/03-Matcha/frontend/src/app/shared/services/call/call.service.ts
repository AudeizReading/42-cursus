import { Injectable } from '@angular/core';
import { CallType, Profile } from '@app/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CallService {
	private callSource = new BehaviorSubject<{ type: CallType; user: Profile } | null>(null);
	public callData = this.callSource.asObservable();

	public sendCall(data: { type: CallType; user: Profile }): void {
		this.callSource.next(data);
	}
}

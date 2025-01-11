import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageKey } from '@app/models';
import { JwtEventService, OauthEventService } from '@app/shared';
import { Observable, ReplaySubject, Subject, share } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class StorageEventService {
	private destroyRef: DestroyRef = inject(DestroyRef);
	private storageSubject: { [key: string]: unknown } = {};
	private destroyedSubject: { [key: string]: unknown } = {};
	private storageKeys: string[] = [StorageKey.ACCESS_TOKEN, StorageKey.OAUTH];
	public constructor(
		private oauthEventService: OauthEventService,
		private jwtEventService: JwtEventService,
	) {
		this.initStorageSubjects();
		this.intercept('all');
	}

	private initStorageSubjects(): void {
		this.storageKeys.forEach((key: string) => {
			this.storageSubject[key] = new ReplaySubject<unknown>(1);
			this.destroyedSubject[key] = new ReplaySubject<unknown>(1);
		});
	}

	private set storageSubjectIntercepted(datas: { key: string; value: unknown }) {
		if (this.storageSubject[datas.key]) {
			(this.storageSubject[datas.key] as ReplaySubject<unknown>).next(datas.value);
		}
	}

	private set destroySubjectIntercepted(datas: { key: string; value: unknown }) {
		if (this.destroyedSubject[datas.key]) {
			(this.destroyedSubject[datas.key] as ReplaySubject<unknown>).next(datas.value);
		}
	}

	public getStorageSubject(key: string): Observable<unknown> {
		return (this.storageSubject[key] as Subject<unknown>).asObservable().pipe(takeUntilDestroyed(this.destroyRef));
	}

	public getDestroySubject(key: string): Observable<unknown> {
		return (this.destroyedSubject[key] as Subject<unknown>).asObservable().pipe(
			takeUntilDestroyed(this.destroyRef),
			share({
				connector: () => new ReplaySubject(1), // bufferize last message
			}),
		);
	}

	public update(keyStorage: string, datas: unknown): void {
		switch (keyStorage) {
			case StorageKey.ACCESS_TOKEN: {
				if (typeof datas === 'string') {
					this.jwtEventService.emitJwtReceived(datas);
				} else {
					this.jwtEventService.emitJwtReceived(JSON.stringify(datas));
				}
				break;
			}
			case StorageKey.OAUTH: {
				this.oauthEventService.emitOauthReceived(datas);
				break;
			}
		}
	}

	public destroy(keyStorage: string): void {
		switch (keyStorage) {
			case StorageKey.ACCESS_TOKEN: {
				this.jwtEventService.emitJwtDestroyed(true);
				break;
			}
			case StorageKey.OAUTH: {
				this.oauthEventService.emitOauthDestroyed(true);
				break;
			}
			case 'all': {
				this.jwtEventService.emitJwtDestroyed(true);
				this.oauthEventService.emitOauthDestroyed(true);
				break;
			}
		}
	}

	private intercept(keyStorage: string): void {
		switch (keyStorage) {
			case StorageKey.ACCESS_TOKEN: {
				this.jwtEventService.jwtReceived$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
					this.storageSubjectIntercepted = { key: StorageKey.ACCESS_TOKEN, value: data };
				});
				this.jwtEventService.jwtDestroyed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
					this.destroySubjectIntercepted = { key: StorageKey.ACCESS_TOKEN, value: data };
				});
				break;
			}
			case StorageKey.OAUTH: {
				this.oauthEventService.oauthReceived$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
					this.storageSubjectIntercepted = { key: StorageKey.OAUTH, value: data };
				});
				this.oauthEventService.oauthDestroyed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
					this.destroySubjectIntercepted = { key: StorageKey.OAUTH, value: data };
				});
				break;
			}
			case 'all': {
				this.jwtEventService.jwtReceived$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
					this.storageSubjectIntercepted = { key: StorageKey.ACCESS_TOKEN, value: data };
				});
				this.jwtEventService.jwtDestroyed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
					this.destroySubjectIntercepted = { key: StorageKey.ACCESS_TOKEN, value: data };
				});
				this.oauthEventService.oauthReceived$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
					this.destroySubjectIntercepted = { key: StorageKey.OAUTH, value: data };
				});
				this.oauthEventService.oauthDestroyed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
					this.destroySubjectIntercepted = { key: StorageKey.OAUTH, value: data };
				});
				break;
			}
		}
	}
}

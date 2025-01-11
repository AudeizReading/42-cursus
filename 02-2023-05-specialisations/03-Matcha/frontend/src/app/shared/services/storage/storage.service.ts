import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterStateSnapshot } from '@angular/router';

import { isOauthProviderDTO, ProfileDTO, StorageKey } from '@app/models';
import { StorageEventService } from '@app/shared';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	private store: { [key: string]: unknown } = {};
	private state!: RouterStateSnapshot;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private storageEventService: StorageEventService,
		private router: Router,
	) {
		try {
			this.state = this.router.routerState.snapshot;
			this.storageEventService
				.getDestroySubject(StorageKey.ACCESS_TOKEN)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((jwt: unknown) => {
					if (jwt) {
						this.checkDatasState('logout');
					}
				});
			this.checkDatasState();
		} catch (_) {
			// ignore
		}
	}

	private getLocalItem<T>(key: string): T | null {
		try {
			const item = window.localStorage.getItem(key);
			if (item) {
				return JSON.parse(item);
			}
			return this.store[key] as T;
		} catch (e) {
			// localStorage n'est pas defini dans le contexte d'utilisation d'angular
			return this.store[key] as T;
		}
		return null;
	}

	private setLocalItem<T>(key: string, value: T): void {
		try {
			this.removeLocalItem(key);
			window.localStorage.setItem(key, JSON.stringify(value));
			this.store[key] = value;
		} catch (e) {
			// localStorage n'est pas defini dans le contexte d'utilisation d'angular
			this.store[key] = value;
		}
	}

	private removeLocalItem(key: string): void {
		try {
			window.localStorage.removeItem(key);
			delete this.store[key];
		} catch (e) {
			// localStorage n'est pas defini dans le contexte d'utilisation d'angular
			delete this.store[key];
		}
	}

	public cleanLocal(): void {
		try {
			window.localStorage.clear();
			this.store = {};
		} catch (e) {
			// localStorage n'est pas defini dans le contexte d'utilisation d'angular
			this.store = {};
		}
	}

	public isAuth(): boolean {
		return !!this.getLocalItem(StorageKey.ACCESS_TOKEN);
	}

	public saveUser<T>(data: T): void {
		let token = typeof data === 'string' ? String(data) : undefined;
		if (!token?.startsWith('"')) token = `"${token}`;
		if (!token?.endsWith('"')) token = `${token}"`;
		const tokenLocal = this.getLocalItem(StorageKey.ACCESS_TOKEN);
		if (tokenLocal) {
			this.storageEventService.destroy(StorageKey.ACCESS_TOKEN);
		}

		const tokenParsed = JSON.parse(token);
		if (tokenParsed !== tokenLocal) {
			this.setLocalItem(StorageKey.ACCESS_TOKEN, tokenParsed);
			this.storageEventService.update(StorageKey.ACCESS_TOKEN, tokenParsed);
		}
	}

	public removeUser(): void {
		this.removeLocalItem(StorageKey.ACCESS_TOKEN);
		this.storageEventService.destroy(StorageKey.ACCESS_TOKEN);
	}

	public getUser<T>(): T | null {
		return this.getLocalItem(StorageKey.ACCESS_TOKEN);
	}

	public saveOauth<T>(data: T): void {
		if (window.localStorage.getItem(StorageKey.OAUTH)) {
			window.localStorage.removeItem(StorageKey.OAUTH);
			this.storageEventService.destroy(StorageKey.OAUTH);
		}

		if (typeof data === 'object' && data && 'access_token' in data) {
			this.saveUser((data as { access_token: string }).access_token);
		} else if (isOauthProviderDTO(data)) {
			this.setLocalItem(StorageKey.OAUTH, data);
			this.storageEventService.update(StorageKey.OAUTH, data);
		}
	}

	public removeOauth(): void {
		this.removeUser();
		this.removeLocalItem(StorageKey.OAUTH);
		this.storageEventService.destroy(StorageKey.OAUTH);
	}

	public getOauth<T>(): T | null {
		return this.getLocalItem(StorageKey.OAUTH);
	}

	private checkDatasState(action: string = 'update'): void {
		const jwt = this.getUser();

		const oauth = this.getOauth();
		if (jwt || oauth) {
			if (action === 'update') {
				if (jwt) this.storageEventService.update(StorageKey.ACCESS_TOKEN, jwt);
				if (oauth) this.storageEventService.update(StorageKey.OAUTH, oauth);
			} else if (action === 'logout') {
				try {
					if (jwt) this.removeUser();
					if (oauth) this.removeOauth();
				} catch (e) {
					if (jwt) this.storageEventService.destroy(StorageKey.ACCESS_TOKEN);
					if (oauth) this.storageEventService.destroy(StorageKey.OAUTH);
				}
				this.store = {};
				this.backToHome();
			}
		}
	}

	public set privateProfile(profile: ProfileDTO) {
		this.store[StorageKey.PROFILE] = profile;
	}

	public get privateProfile(): ProfileDTO | undefined {
		return this.store[StorageKey.PROFILE] as ProfileDTO | undefined;
	}

	public removeProfile(): void {
		if (this.privateProfile) delete this.store[StorageKey.PROFILE];
	}

	private backToHome(): void {
		this.router.navigate(['/'], {
			state: {
				previousUrl: this.router.url,
				currentUrl: this.state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			},
		});
	}

	public logout(): void {
		try {
			this.checkDatasState('logout');
		} catch {
			this.storageEventService.destroy(StorageKey.ACCESS_TOKEN);
			this.storageEventService.destroy(StorageKey.OAUTH);
			this.store = {};
		}
	}
}

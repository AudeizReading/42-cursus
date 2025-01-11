import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiService, LoggerService, LogType, StorageService } from '@app/shared';
import { AccessTokenDTO, ApiQuery, AuthResponseDTO, LoginDTO, RegistrationDTO } from '@app/models';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	public constructor(
		private logger: LoggerService,
		private storage: StorageService,
		private apiService: ApiService,
	) {}

	public login(username: string, password: string): Observable<AccessTokenDTO> {
		try {
			return this.apiService.post<ApiQuery, LoginDTO>('v1.auth.login', {
				body: { username, password },
			}) as Observable<AccessTokenDTO>;
		} catch (error) {
			this.logger.handleError<LoginDTO>('auth login', { username, password });
		}
		return of(null) as unknown as Observable<AccessTokenDTO>;
	}

	public logout(): Observable<AuthResponseDTO> {
		this.storage.logout();
		this.logger.log('Logout success', 'INFO' as LogType);
		return of({ message: 'Logout success' });
	}

	public register(data: RegistrationDTO): Observable<AuthResponseDTO> {
		try {
			return this.apiService.post<ApiQuery, RegistrationDTO>('v1.registration', {
				body: data,
			}) as Observable<AuthResponseDTO>;
		} catch (error) {
			this.logger.handleError<RegistrationDTO>('v1.registration', data);
		}
		return of({ message: 'not ok' });
	}
}

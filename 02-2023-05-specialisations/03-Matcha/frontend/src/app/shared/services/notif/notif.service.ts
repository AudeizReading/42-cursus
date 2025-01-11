import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	ApiBody,
	ApiQuery,
	NbNotificationsResponseDTO,
	NbNotificationsRTO,
	NotificationAPIQueryDTO,
	NotificationAPIV2QueryDTO,
	NotificationResponseDTO,
	NotificationRTO,
} from '@app/models';
import { ApiService, LoggerService, SocketService } from '@app/shared';
import { Observable, of, share, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NotifService {
	private destroyRef: DestroyRef = inject(DestroyRef);
	private notifSubject = new Subject<NotificationRTO>();
	public notif$: Observable<NotificationRTO> = this.notifSubject.asObservable();

	private nbNotifSubject = new Subject<NbNotificationsRTO>();
	public nbNotif$: Observable<NbNotificationsRTO> = this.nbNotifSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	public constructor(
		private apiService: ApiService,
		private socketService: SocketService,
		private logger: LoggerService,
	) {
		this.setupNbNotificationState();
		this.setupNotificationState();
	}

	private setupNotificationState(): void {
		this.socketService
			.getIncomingPayloads$('notification')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			?.subscribe({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				next: (payload: any) => {
					this.notifSubject.next(payload);
				},
			});
	}

	private setupNbNotificationState(): void {
		this.socketService
			.getIncomingPayloads$('notificationNotRead')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				next: (payload: any) => {
					this.nbNotifSubject.next(payload);
				},
			});
	}

	public getNbUnreadNotifsApi(): Observable<NbNotificationsResponseDTO> {
		try {
			return this.apiService.get<ApiQuery, ApiBody>(
				'v1.notification.unread',
			) as Observable<NbNotificationsResponseDTO>;
		} catch (error) {
			this.logger.handleError<unknown>('v1.notification.unread', error);
		}
		return of(null) as unknown as Observable<NbNotificationsResponseDTO>;
	}

	public getNotifsApi(limit: number = 5, page: number = 0): Observable<NotificationResponseDTO[]> {
		try {
			return this.apiService.get<NotificationAPIQueryDTO, ApiBody>('v1.notification.endpoint', {
				query: { limit, page },
			}) as Observable<NotificationResponseDTO[]>;
		} catch (error) {
			this.logger.handleError<{
				query: NotificationAPIQueryDTO;
			}>('notification.endpoint', {
				query: { limit, page },
			});
		}
		return of(null) as unknown as Observable<NotificationResponseDTO[]>;
	}

	public getNotifsApiV2(limit: number = 5, maxId?: number): Observable<NotificationResponseDTO[]> {
		try {
			return this.apiService.get<NotificationAPIV2QueryDTO, ApiBody>('v2.notification.endpoint', {
				query: maxId ? { limit, maxId } : { limit },
			}) as Observable<NotificationResponseDTO[]>;
		} catch (error) {
			this.logger.handleError<{
				query: NotificationAPIV2QueryDTO;
			}>('v2.notification.endpoint', {
				query: { limit, maxId },
			});
		}
		return of(null) as unknown as Observable<NotificationResponseDTO[]>;
	}

	public setNotifAsReadApi(notifId: string): Observable<unknown> {
		try {
			return this.apiService.put<ApiQuery, ApiBody>('v1.notification.id', {
				params: notifId,
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<{
				params: string;
			}>('v1.notification.id', {
				params: notifId,
			});
		}
		return of(null) as unknown as Observable<unknown>;
	}

	public deleteNotifApi(notifId: string): Observable<unknown> {
		try {
			return this.apiService.delete<ApiQuery, ApiBody>('v1.notification.id', {
				params: notifId,
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<{
				params: string;
			}>('v1.notification.id', {
				params: notifId,
			});
		}
		return of(null) as unknown as Observable<unknown>;
	}
}

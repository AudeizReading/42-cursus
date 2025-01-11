import { io, Socket } from 'socket.io-client';
import { DestroyRef, inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject, fromEvent, of, share, switchMap } from 'rxjs';
import { AlertService, ProfileService, StorageEventService } from '@app/shared';
import {
	AcceptCallDTO,
	AlertFacade,
	EndCallDTO,
	PayloadPub,
	PayloadSub,
	ReadMessageDTO,
	SendCallDTO,
	SendMessageDTO,
	SocketEventPayload,
	SocketEventPub,
	SocketEventSub,
	StorageKey,
	TyppingDTO,
} from '@app/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
	providedIn: 'root',
})
export class SocketService extends AlertFacade implements OnDestroy {
	private socket!: Socket | null;
	private bearerToken: string | null;
	private eventsSub: SocketEventSub[] = [
		'sendMessage',
		'readMessage',
		'message',
		'acceptCall',
		'endCall',
		'call',
		'typping',
		'notAvailableCall',
		'notification',
		'notificationNotRead',
		'onlineStatusMatch',
		'unreadMessage',
	];

	// share -> pour multicast l'observable: permet de suscribe l'event a plusieurs endroits du code
	private payloadsSubSubjects: { [event: string]: Subject<SocketEventPayload<SocketEventPub | SocketEventSub>> } = {};

	private errorSubject = new Subject<string>();
	public error$: Observable<string> = this.errorSubject.asObservable().pipe(
		share({
			connector: () => new ReplaySubject(1), // bufferize last message
		}),
	);

	private askConnectionSubject = new Subject<() => void>();
	public askConnection$: Observable<() => void> = this.askConnectionSubject.asObservable();

	private connectedSubject = new Subject<boolean>();
	public connected$ = this.connectedSubject.asObservable().pipe(
		share({
			connector: () => new ReplaySubject(1), // bufferize last message
		}),
	);
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private storageEventService: StorageEventService,
		private profileService: ProfileService,
		alertService: AlertService,
	) {
		super(alertService);
		this.bearerToken = null;
		this.connect = this.connect.bind(this);
		this.init = this.init.bind(this);
		this.onError = this.onError.bind(this);
		this.initPayloadsSubjects();
	}

	public init(): void {
		this.onJwtReceived().onJwtDestroyed().onAskForConnection();
	}

	private onAskForConnection(): SocketService {
		this.askConnection$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				switchMap((callback) => {
					if (typeof callback === 'function') {
						return this.profileService.isAPIComplete();
					} else {
						return of(false);
					}
				}),
			)
			.subscribe((complete: boolean) => {
				if (this.connected) {
					this.disconnect();
				}
				if (complete && !this.connected && this.bearerToken) {
					this.create();
					this.connect();
				}
			});
		return this;
	}

	private onJwtReceived(): SocketService {
		this.storageEventService
			.getStorageSubject(StorageKey.ACCESS_TOKEN)
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				switchMap((bearer) => {
					if (bearer) {
						this.bearerToken = bearer as string;
						return this.profileService.isAPIComplete();
					} else {
						return of(false);
					}
				}),
			)
			.subscribe((complete: boolean) => {
				if (this.connected) {
					this.disconnect();
				}
				if (complete && !this.connected) {
					this.create();
					this.connect();
				}
			});
		return this;
	}

	public askForConnection(callback: () => void): void {
		callback();
		if (this.bearerToken) this.askConnectionSubject.next(callback);
	}

	private onJwtDestroyed(): SocketService {
		this.storageEventService
			.getDestroySubject(StorageKey.ACCESS_TOKEN)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((jwt: unknown) => {
				if (jwt) {
					this.bearerToken = null;
					this.disconnect();
				}
			});
		return this;
	}

	private create(): Socket | null {
		if (this.socket || this.bearerToken === null || this.bearerToken.length === 0) {
			if (this.socket) {
				this.disconnect();
				this.socket = null;
			} else {
				return null;
			}
		}
		this.socket = io({
			transports: ['websocket'],
			autoConnect: false,
			reconnection: false,
			withCredentials: true,
			path: '/socket.io',
			auth: {
				token: this.bearerToken,
			},
		});

		this.eventsSub.forEach((event: SocketEventSub) => {
			this.receiveFrom(event)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((data: unknown) => {
					this.payloadReceived = { event, data } as unknown as SocketEventPayload<
						SocketEventPub | SocketEventSub
					>;
				});
		});

		this.connected$ = this.onConnected();
		this.error$ = this.onError();

		return this.socket;
	}

	private onConnected(): Observable<boolean> {
		const connectedEvents = ['connect', 'disconnect'];
		connectedEvents.forEach((event: string) => {
			this.receiveFrom(event)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((reason: unknown) => {
					if (event === 'connect') {
						this.connectedSubject.next(true);
					} else if (event === 'disconnect') {
						const msg = [event, reason as unknown as string].join(': ');
						if (!(reason as string).includes('transport close')) {
							this.alert('error', msg);
						}
						this.connectedSubject.next(false);

						this.disconnect();
					}
				});
		});
		return this.connectedSubject.asObservable().pipe(
			takeUntilDestroyed(this.destroyRef),
			share({
				connector: () => new ReplaySubject(1), // bufferize last message
			}),
		);
	}

	private onError(): Observable<string> {
		const errorEvents = [
			'error',
			'connect_error',
			'connect_timeout',
			'reconnect_attempt',
			'reconnecting',
			'reconnect_error',
			'reconnect_failed',
		];
		errorEvents.forEach((event: string) => {
			this.receiveFrom(event)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((data: unknown) => {
					const msg = [event, data as unknown as string].join(': ');
					this.alert('error', msg);
					this.disconnect();
					this.errorSubject.next(msg);
				});
		});
		return this.errorSubject.asObservable().pipe(
			share({
				connector: () => new ReplaySubject(1), // bufferize last message
			}),
		);
	}

	private connect(): Socket | null {
		if (!this.socket) {
			return null;
		}
		return this.socket.connect();
	}

	private disconnect(): Socket | null {
		if (this.socket?.connected) {
			this.socket?.removeAllListeners();

			this.socket?.disconnect();
			this.socket = null;
			return this.socket;
		}
		return null;
	}

	public getIncomingPayloads$<TEvent extends SocketEventPub | SocketEventSub>(
		event: TEvent,
	): Observable<PayloadSub> | null {
		if (!this.payloadsSubSubjects[event]) {
			return null;
		}
		return this.payloadsSubSubjects[event].asObservable().pipe(
			switchMap((payload: unknown) => {
				const { data } = payload as unknown as { event: string; data: PayloadSub };
				return of(data as PayloadSub);
			}),
			share({
				connector: () => new ReplaySubject(1), // bufferize last message
			}),
		);
	}

	private initPayloadsSubjects(): void {
		this.eventsSub.forEach((event: SocketEventSub) => {
			this.payloadsSubSubjects[event] = new ReplaySubject<SocketEventPayload<SocketEventPub | SocketEventSub>>(1);
		});
	}

	private set payloadReceived(payload: SocketEventPayload<SocketEventPub | SocketEventSub>) {
		if (!this.payloadsSubSubjects[payload.event]) {
			return;
		}
		this.payloadsSubSubjects[payload.event].next(payload);
	}

	public get connected(): boolean {
		return this.socket?.connected || false;
	}

	private receiveFrom(event: string): Observable<PayloadSub | null> {
		if (!this.socket) {
			return of(null);
		}
		return fromEvent(this.socket, event).pipe();
	}

	private sendTo(event: string): Subject<PayloadPub> {
		const subject = new Subject<PayloadPub>();
		const observer = {
			next: (payload: PayloadPub): void => {
				// besoin any pour ...args
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				this.socket?.emit(event, payload, (...args: any) => {
					subject.next(args);
				});
			},
		};
		subject.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(observer);
		return subject;
	}

	public sendMessage(payload: SendMessageDTO): void {
		this.sendTo('sendMessage').next(payload);
	}

	public readMessage(payload: ReadMessageDTO): void {
		this.sendTo('readMessage').next(payload);
	}

	public sendCall(payload: SendCallDTO): void {
		this.sendTo('sendCall').next(payload);
	}

	public acceptCall(payload: AcceptCallDTO): void {
		this.sendTo('acceptCall').next(payload);
	}

	public endCall(payload: EndCallDTO): void {
		this.sendTo('endCall').next(payload);
	}

	public typping(payload: TyppingDTO): void {
		this.sendTo('typping').next(payload);
	}

	public ngOnDestroy(): void {
		this.disconnect();
	}
}

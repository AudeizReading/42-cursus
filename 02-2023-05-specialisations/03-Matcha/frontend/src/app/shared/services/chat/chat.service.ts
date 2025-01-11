/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	AcceptCallDTO,
	ApiBody,
	ApiQuery,
	ChatConversationAPIQueryDTO,
	ChatConversationAPIResponseDTO,
	ChatMediaAPIBodyDTO,
	ChatMediaAPIResponseDTO,
	ChatSendMessageAPIBodyDTO,
	ChatSendMessageAPIResponseDTO,
	EndCallDTO,
	NotAvailableCallRTO,
	OnlineStatusMatchRTO,
	ReadMessageRTO,
	ReceiveCallRTO,
	TyppingState,
	UnReadMessageRTO,
} from '@app/models';
import { FileType } from '@app/models/file';
import { ApiService, LoggerService, SocketService } from '@app/shared';
import { Subject, debounceTime, Observable, of, share } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ChatService {
	private destroyRef: DestroyRef = inject(DestroyRef);
	private correspondantTyppingSubject = new Subject<TyppingState>();
	public correspondantTypping$: Observable<TyppingState> = this.correspondantTyppingSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	private messageSentSubject = new Subject<boolean>();
	public messageSent$: Observable<boolean> = this.messageSentSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	private messageReadSubject = new Subject<ReadMessageRTO>();
	public messageRead$: Observable<ReadMessageRTO> = this.messageReadSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	private messageUnReadSubject = new Subject<UnReadMessageRTO>();
	public messageUnRead$: Observable<UnReadMessageRTO> = this.messageUnReadSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	private onlineSubject = new Subject<OnlineStatusMatchRTO>();
	public online$: Observable<OnlineStatusMatchRTO> = this.onlineSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	private messageSubject = new Subject<ReadMessageRTO>();
	public message$: Observable<ReadMessageRTO> = this.messageSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	private acceptCallSubject = new Subject<AcceptCallDTO>();
	public acceptCall$: Observable<AcceptCallDTO> = this.acceptCallSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	private endCallSubject = new Subject<EndCallDTO>();
	public endCall$: Observable<EndCallDTO> = this.endCallSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	private callSubject = new Subject<ReceiveCallRTO>();
	public call$: Observable<ReceiveCallRTO> = this.callSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	private unreacheableCallSubject = new Subject<NotAvailableCallRTO>();
	public unreacheableCall$: Observable<NotAvailableCallRTO> = this.unreacheableCallSubject
		.asObservable()
		.pipe(takeUntilDestroyed(this.destroyRef), share({}));

	public constructor(
		private apiService: ApiService,
		private socketService: SocketService,
		private logger: LoggerService,
	) {
		this.setupCorrespondantTypping();
		this.setupMessageSentState();
		this.setupMessageReadState();
		this.setupMessageUnReadState();
		this.setupOnlineStatusMatchState();
		this.setupMessageState();
		this.setupAcceptCallState();
		this.setupEndCallState();
		this.setupCallState();
		this.setupUnreacheableCallState();
		this.setupMessage();
	}

	public getConversation(
		correspondantId: number,
		limit: number = 5,
		maxId?: number,
	): Observable<ChatConversationAPIResponseDTO[]> {
		try {
			return this.apiService.get<ChatConversationAPIQueryDTO, ApiBody>('v2.chat.message.id', {
				params: correspondantId.toString(),
				query: maxId ? { limit, maxId } : { limit },
			}) as Observable<ChatConversationAPIResponseDTO[]>;
		} catch (error) {
			this.logger.handleError<{
				params: string;
				query: ChatConversationAPIQueryDTO;
			}>('v2.chat.message.id', {
				params: correspondantId.toString(),
				query: maxId ? { limit, maxId } : { limit },
			});
		}
		return of(null) as unknown as Observable<ChatConversationAPIResponseDTO[]>;
	}

	public getLastMessage(correspondantId: number): Observable<ChatConversationAPIResponseDTO[]> {
		try {
			return this.apiService.get<ChatConversationAPIQueryDTO, ApiBody>('v2.chat.message.id', {
				params: correspondantId.toString(),
				query: { limit: 1 },
			}) as Observable<ChatConversationAPIResponseDTO[]>;
		} catch (error) {
			this.logger.handleError<{
				params: string;
				query: ChatConversationAPIQueryDTO;
			}>('v2.chat.message.id', {
				params: correspondantId.toString(),
				query: { limit: 1 },
			});
		}
		return of(null) as unknown as Observable<ChatConversationAPIResponseDTO[]>;
	}

	public sendApiMessage(correspondantId: number, message: string): Observable<ChatSendMessageAPIResponseDTO> {
		try {
			return this.apiService.post<ApiQuery, ChatSendMessageAPIBodyDTO>('v1.chat.message.send', {
				params: correspondantId.toString(),
				body: { userId: correspondantId, message },
			}) as Observable<ChatSendMessageAPIResponseDTO>;
		} catch (error) {
			this.logger.handleError<{
				body: ChatSendMessageAPIBodyDTO;
			}>('v1.chat.message.send', {
				body: { userId: correspondantId, message },
			});
		}
		return of(null) as unknown as Observable<ChatSendMessageAPIResponseDTO>;
	}

	public sendSocketMessage(correspondantId: number, message: string): void {
		this.socketService.sendMessage({ userId: correspondantId, message });
	}

	public sendApiMedia(mediaDatas: {
		type: FileType;
		datas: ChatMediaAPIBodyDTO;
	}): Observable<HttpResponse<ChatMediaAPIResponseDTO>> {
		{
			try {
				const { datas, type } = mediaDatas;
				const { file, userId } = datas;

				const formData = new FormData();
				formData.append('file', file, file.name);
				formData.append('userId', userId.toString());

				return this.apiService.post<ApiQuery, FormData>(`v1.file.chat.${type.toLowerCase()}`, {
					body: formData,
				}) as Observable<HttpResponse<ChatMediaAPIResponseDTO>>;
			} catch (error) {
				this.logger.handleError<{
					body: ChatMediaAPIBodyDTO;
				}>(`v1.file.chat.${mediaDatas.type.toLowerCase()}`, {
					body: mediaDatas.datas,
				});
			}
			return of(null) as unknown as Observable<HttpResponse<ChatMediaAPIResponseDTO>>;
		}
	}

	public readApiMessage(messageId: number): Observable<ChatSendMessageAPIResponseDTO> {
		try {
			return this.apiService.put<ApiQuery, ApiBody>('v1.chat.message.read.id', {
				params: messageId.toString(),
			}) as Observable<ChatSendMessageAPIResponseDTO>;
		} catch (error) {
			this.logger.handleError<{
				params: string;
			}>('v1.chat.message.read.id', {
				params: messageId.toString(),
			});
		}
		return of(null) as unknown as Observable<ChatSendMessageAPIResponseDTO>;
	}

	public readSocketMessage(messageId: number): void {
		this.socketService.readMessage({ messageId });
	}

	public get messageReadState(): Observable<ReadMessageRTO> {
		return this.messageRead$;
	}

	private setupMessageReadState(): void {
		this.socketService
			.getIncomingPayloads$('readMessage')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload: any) => {
					this.messageReadSubject.next(payload);
				},
			});
	}

	public unreadApiMessage(): Observable<UnReadMessageRTO> {
		try {
			return this.apiService.get<ApiQuery, ApiBody>('v1.chat.unread') as Observable<UnReadMessageRTO>;
		} catch (error) {
			this.logger.handleError('v1.chat.unread');
		}
		return of(null) as unknown as Observable<UnReadMessageRTO>;
	}

	public get messageUnReadState(): Observable<UnReadMessageRTO> {
		return this.messageUnRead$;
	}

	private setupMessageUnReadState(): void {
		this.socketService
			.getIncomingPayloads$('unreadMessage')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload: any) => {
					this.messageUnReadSubject.next(payload);
				},
			});
	}

	public get onlineState(): Observable<OnlineStatusMatchRTO> {
		return this.online$;
	}

	private setupOnlineStatusMatchState(): void {
		this.socketService
			.getIncomingPayloads$('onlineStatusMatch')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload: any) => {
					this.onlineSubject.next(payload);
				},
			});
	}

	public get messageState(): Observable<ReadMessageRTO> {
		return this.message$;
	}

	private setupMessage(): void {
		this.socketService
			.getIncomingPayloads$('message')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload: any) => {
					this.messageSubject.next(payload);
				},
			});
	}

	private setupMessageState(): void {
		this.socketService
			.getIncomingPayloads$('message')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload: any) => {
					this.messageReadSubject.next(payload);
				},
			});
	}

	public type(userId: number): void {
		this.socketService.typping({ userId });
	}

	public get typpingState(): Observable<TyppingState> {
		return this.correspondantTypping$;
	}

	private setupCorrespondantTypping(): void {
		this.socketService
			.getIncomingPayloads$('typping')
			?.pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload) => {
					if (!payload) {
						return;
					}
					const { userId } = payload as { userId: number };
					this.correspondantTyppingSubject.next({ isTypping: true, userId });
				},
			});
	}

	public get messageSentState(): Observable<boolean> {
		return this.messageSent$;
	}

	private setupMessageSentState(): void {
		this.socketService
			.getIncomingPayloads$('sendMessage')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload: any) => {
					const { status } = payload;
					this.messageSentSubject.next(status);
				},
			});
	}

	// rtcId is the id of the user who is calling by webrtc protocol
	public sendCall(type: 'AUDIO' | 'VIDEO', userId: number, rtcId: string): void {
		this.socketService.sendCall({ rtcId, userId, type });
	}

	public acceptCall(rtcId: string): void {
		this.socketService.acceptCall({ rtcId });
	}

	public get acceptCallState(): Observable<AcceptCallDTO> {
		return this.acceptCall$;
	}

	private setupAcceptCallState(): void {
		this.socketService
			.getIncomingPayloads$('acceptCall')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload: any) => {
					this.acceptCallSubject.next(payload);
				},
			});
	}

	public endCall(): void {
		this.socketService.endCall({});
	}

	public get endCallState(): Observable<EndCallDTO> {
		return this.endCall$;
	}

	private setupEndCallState(): void {
		this.socketService
			.getIncomingPayloads$('endCall')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload: any) => {
					this.endCallSubject.next(payload);
				},
			});
	}

	public get callState(): Observable<ReceiveCallRTO> {
		return this.call$;
	}

	private setupCallState(): void {
		this.socketService
			.getIncomingPayloads$('call')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload: any) => {
					this.callSubject.next(payload);
				},
			});
	}

	public get unreacheableCallState(): Observable<NotAvailableCallRTO> {
		return this.unreacheableCall$;
	}

	private setupUnreacheableCallState(): void {
		this.socketService
			.getIncomingPayloads$('notAvailableCall')
			?.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload: any) => {
					this.unreacheableCallSubject.next(payload);
				},
			});
	}
}

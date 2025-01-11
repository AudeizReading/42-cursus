import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	ElementRef,
	inject,
	OnInit,
	ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { FooterActionComponent, HeaderActionComponent, MessagePreviewLoadingComponent } from '@app/components';
import { MessagePreviewComponent } from '@app/components/chat/message-preview/message-preview.component';
import { LayoutComponent } from '@app/layout';
import { AlertFacade, ChatConversationAPIResponseDTO, ChatMessage, ProfileDTO, UnReadMessageRTO } from '@app/models';
import { Notification } from '@app/models';
import { FileType } from '@app/models/file';
import { AlertService, ChatService, NotifService, ProfileService, UserService } from '@app/shared';
import { filter, forkJoin, map, Observable, of, switchMap } from 'rxjs';

@Component({
	selector: 'app-chat',
	standalone: true,
	imports: [
		RouterModule,
		CommonModule,
		LayoutComponent,
		HeaderActionComponent,
		FooterActionComponent,
		MessagePreviewComponent,
		MessagePreviewLoadingComponent,
	],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent extends AlertFacade implements OnInit {
	protected profile!: ProfileDTO;
	protected messages: { online: boolean; match: ProfileDTO; message: ChatConversationAPIResponseDTO }[] = [];
	@ViewChild('chat') public chatContainer!: ElementRef;
	private page: number = 0;
	private limit: number = 100;
	protected needToFetchTheNextSet: boolean = true;
	protected state!: RouterStateSnapshot;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private profileService: ProfileService,
		alertService: AlertService,
		private userService: UserService,
		private chatService: ChatService,
		private notifService: NotifService,
		protected router: Router,
		private changeDetector: ChangeDetectorRef,
	) {
		super(alertService);
		this.state = this.router.routerState.snapshot;
		this.listenToMessage();
		this.listenToRead();
		this.listenToUnread();
		this.listenToOnline();
		this.listenToNewMatch();
	}

	public ngOnInit(): void {
		this.profileService.profile$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				switchMap((profile) => {
					this.profile = { ...profile };
					return this.getMatches();
				}),
			)
			.subscribe({
				next: this.updateMessages.bind(this),
				error: (error) => {
					this.alert('error', `Error while getting messages ${JSON.stringify(error)}`);
				},
			});
	}

	private getMatches(): Observable<
		{ online: boolean; match: ProfileDTO; message: ChatConversationAPIResponseDTO }[]
	> {
		return this.chatService.unreadApiMessage().pipe(
			switchMap((unread) =>
				this.userService
					.matches(this.limit, this.page)
					.pipe(map((matches): [ProfileDTO[], UnReadMessageRTO] => [matches, unread])),
			),
			switchMap(([matches, unread]: [ProfileDTO[], UnReadMessageRTO]) => {
				if (matches.length === 0) {
					return of([]);
				}
				return forkJoin(matches.map((match: ProfileDTO) => this.getConversationData(match, unread)));
			}),
		);
	}

	private getConversationData(
		match: ProfileDTO,
		unreadMessages: UnReadMessageRTO,
	): Observable<{
		online: boolean;
		match: ProfileDTO;
		message: ChatConversationAPIResponseDTO;
		unreadCount: number;
	}> {
		const online = match.status.toLowerCase() === 'online';
		const unreadForThisMatch = unreadMessages?.unreadMessages?.find((unread) => unread.userId === match.id);
		const unreadCount = unreadForThisMatch ? unreadForThisMatch.number : 0;

		return this.chatService.getConversation(match.id, 1).pipe(
			map((messages) => {
				return {
					online,
					match,
					message: this.createChatMessage(messages, match, unreadCount),
					unreadCount,
				};
			}),
		);
	}

	private getFileTypeMsg(type: FileType): string {
		switch (type) {
			case 'VIDEO':
				return '🎥 No preview message for video 🎥 ';
			case 'PICTURE':
				return '📸 No picture preview message 📸';
			case 'AUDIO':
				return '🎧 No preview message for audio 🎧';
			default:
				return '';
		}
	}

	private createChatMessage(
		messages: ChatConversationAPIResponseDTO[],
		match: ProfileDTO,
		unreadCount: number,
	): ChatMessage {
		const message = messages[0]?.message
			? messages[0]?.message
			: messages[0]?.file
				? this.getFileTypeMsg(messages[0]?.file?.type)
				: `Start a new conversation with ${match.username}`;
		if (messages.length === 0) {
			// Si aucun message n'a encore été échangé
			return new ChatMessage({
				id: 0,
				message: message,
				sender: this.profile,
				receiver: match,
				read: false,
			});
		} else {
			// Sinon, retourner le dernier message et ajuster selon les messages non lus

			return new ChatMessage({
				...messages[0],
				message: message,
				read: unreadCount ? false : true,
			});
		}
	}

	private listenToUnread(): void {
		this.suscribeToUnread(this.chatService.messageUnReadState);
	}

	private suscribeToUnread(ev: Observable<UnReadMessageRTO>): void {
		ev.pipe(
			filter((payload) => {
				return payload.total > 0;
			}),
			takeUntilDestroyed(this.destroyRef),
		).subscribe({
			next: (payload) => {
				this.updateUnreadChatMessage(payload);
			},
		});
	}

	private updateUnreadChatMessage(msg: UnReadMessageRTO, read: boolean = false): void {
		const matchesToUpdate =
			msg.total > 0 ? msg.unreadMessages.reduce((acc, cur) => [...acc, cur.userId], [] as number[]) : [];

		matchesToUpdate.forEach((userId) => {
			const toUpdate = this.messages.find((m) => m.match.id === userId);
			if (toUpdate) {
				toUpdate.message.read = read;
			}
		});

		this.changeDetector.detectChanges();
	}

	private listenToRead(): void {
		this.chatService.messageReadState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((payload) => {
			if (payload.read) {
				this.updateNewIncomingChatMessage(payload, true);
			}
		});
	}

	private listenToMessage(): void {
		this.chatService.messageState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((payload) => {
			this.updateNewIncomingChatMessage(payload);
		});
	}

	private listenToNewMatch(): void {
		this.notifService.notif$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: (payload) => {
				const { type, fromUser } = payload;

				if (!payload || !type || !fromUser) {
					return;
				}
				const { username, status } = fromUser;
				const notif = new Notification(payload);

				if (notif.type === 'MATCH') {
					const toUpdate = {
						online: status.toLowerCase() === 'online',
						match: { ...fromUser },
						message: new ChatMessage({
							message: `Start a new conversation with ${username}`,
							read: false,
						}),
					};
					this.messages = [toUpdate, ...this.messages];
				} else if (notif.type === 'UNLIKE') {
					this.messages = this.messages.filter((m) => m.match.id !== fromUser.id);
				}
				this.changeDetector.detectChanges();
			},
		});
	}

	private listenToOnline(): void {
		this.chatService.onlineState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((payload) => {
			const toUpdate = this.messages.find((m) => m.match.id === payload.userId);
			if (toUpdate) {
				toUpdate.online = payload.status.toLowerCase() === 'online';
				this.changeDetector.detectChanges();
			}
		});
	}

	private updateNewIncomingChatMessage(msg: ChatConversationAPIResponseDTO, read: boolean = false): void {
		let toUpdate = this.messages.find((m) => m.match.id === msg.sender?.id || m.match.id === msg.receiver?.id);
		if (toUpdate) {
			const message = msg?.message
				? msg?.message
				: msg?.file
					? this.getFileTypeMsg(msg?.file?.type)
					: `Start a new conversation with ${msg.sender?.username}`;

			toUpdate.message = new ChatMessage({
				message: message,
				read,
			});
		} else {
			toUpdate = {
				online: msg.sender?.status.toLowerCase() === 'online',
				match: msg.sender!,
				message: new ChatMessage({
					...msg,
					read,
				}),
			};
			this.messages = [toUpdate, ...this.messages];
		}
		this.changeDetector.detectChanges();
	}

	private updateMessages(
		payload: { online: boolean; match: ProfileDTO; message: ChatConversationAPIResponseDTO }[],
	): void {
		if (payload) {
			if (this.page > 0) {
				this.messages = [...this.messages, ...payload];
			} else {
				this.messages = [...payload];
			}

			if (payload.length === this.limit) {
				this.page++;
				this.needToFetchTheNextSet = true;
			} else {
				this.needToFetchTheNextSet = false;
			}
		} else {
			this.needToFetchTheNextSet = false;
		}
		this.changeDetector.detectChanges();
	}

	public onScroll(): void {
		this.matchToChat();
	}

	private matchToChat(): void {
		const elm: HTMLElement = this.chatContainer.nativeElement;

		elm.childNodes.forEach((e) => {
			const node = e as HTMLDivElement;

			if (node.getBoundingClientRect) {
				const rect = node.getBoundingClientRect();
				const viewHeight = window.innerHeight || document.documentElement.clientHeight;
				if (rect.y >= 0 && rect.y <= viewHeight && this.needToFetchTheNextSet) {
					this.getMatches()
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe(this.updateMessages.bind(this));
				}
			}
		});
	}
}

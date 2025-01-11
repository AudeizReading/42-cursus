import { CommonModule } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewChild,
	AfterViewInit,
	ElementRef,
	DestroyRef,
	inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderActionComponent, MessageComponent, SendBarComponent } from '@app/components';
import { LayoutComponent } from '@app/layout';
import { CallType, ChatConversationAPIResponseDTO, ChatSendMessageAPIResponseDTO, Profile } from '@app/models';
import { AlertService, CallService, ChatService, ProfileService, SoundsService } from '@app/shared';
import { concatMap, from, map, Observable, of, switchMap, toArray } from 'rxjs';

@Component({
	selector: 'app-conversation',
	standalone: true,
	imports: [MessageComponent, SendBarComponent, CommonModule, LayoutComponent, HeaderActionComponent],
	templateUrl: './conversation.component.html',
	styleUrl: './conversation.component.scss',
})
export class ConversationComponent implements OnInit, AfterViewInit {
	protected correspondant!: Profile;
	protected user!: Profile;
	protected correspondantId!: number;
	protected userId!: number;
	protected correspondantUsername: string = '';
	protected isWriting: boolean = false;
	protected messages: ChatConversationAPIResponseDTO[] = [];
	protected messageOffset: number = 0;

	private destroyRef: DestroyRef = inject(DestroyRef);

	private timeout: NodeJS.Timeout | undefined;
	private loading = false;

	public constructor(
		private route: ActivatedRoute,
		private profileService: ProfileService,
		protected chatService: ChatService,
		private alertService: AlertService,
		private changeDetector: ChangeDetectorRef,
		private readonly soundsService: SoundsService,
		private readonly callService: CallService,
		private readonly router: Router,
	) {
		this.soundsService.init().declareMessage();
		this.correspondantId = parseInt(this.route.snapshot.params['correspondantId']);
	}

	@ViewChild('div') public conversationContainer!: ElementRef;

	public ngOnInit(): void {
		this.profileService.profile$
			.pipe(
				// switchMap permet de transformer l'observable de profile$
				// en un nouvel observable qui attend de recup le profile avant
				// de fetch la conversation

				takeUntilDestroyed(this.destroyRef),
				switchMap((profile) => {
					this.user = new Profile({ ...profile });
					this.userId = this.user.id!;
					this.changeDetector.detectChanges();
					return this.chatService.getConversation(this.correspondantId, 100);
				}),
				switchMap((conversation) => {
					if (conversation.length === 0 || !conversation || !('id' in conversation[0])) {
						return this.profileService.getProfileById(this.correspondantId.toString()).pipe(
							map((profile) => {
								this.correspondant = new Profile(profile);
								this.correspondantUsername = this.correspondant.username!;
								this.messageOffset = 0;
								this.changeDetector.detectChanges();
								return [];
							}),
						);
					}
					this.messageOffset = conversation[conversation.length - 1].id;
					this.setCorrespondantDetails(conversation, this.correspondantId);
					return this.setAsRead(conversation, this.userId);
				}),
			)
			.subscribe({
				error: (error) => {
					if (error.status === 401) {
						this.router.navigate(['/error'], {
							state: {
								code: error.error.statusCode,
								status: error.error.error,
								message: error.error.message,
								previousUrl: '/chat',
								currentUrl: `/chat/conversation/${this.correspondantId}`,
							},
						});
					} else {
						this.alert('error', error.message);
					}
				},
			});

		this.watchIsTypping();
	}

	public ngAfterViewInit(): void {
		const interval = setInterval(() => {
			if (this.conversationContainer) {
				this.scrollToBottom();
				this.messageToRead();
				this.getMessagesSocket();
				clearInterval(interval);
			}
		}, 100);
	}

	private getPrevMessage(): void {
		if (this.loading) return;
		this.loading = true;
		if (this.messages.length) {
			this.chatService
				.getConversation(this.correspondantId, 100, this.getMessages()[0].id)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((data) => {
					this.loading = false;
					this.messages = [...data, ...this.messages];
				});
		}
	}

	private scrollToBottom(): void {
		const elm: HTMLElement = this.conversationContainer.nativeElement;
		elm.scrollTop = elm.scrollHeight;
	}

	private scrollToNewMessageAuthorized(): boolean {
		const elm: HTMLElement = this.conversationContainer?.nativeElement;
		const value = Math.abs(elm.scrollHeight - elm.clientHeight - elm.scrollTop);
		return value <= 50;
	}

	private getMessagesSocket(): void {
		this.chatService.messageState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
			const msg: ChatConversationAPIResponseDTO = data;
			this.isWriting = false;
			if (data.receiver!.id == this.correspondantId || data.sender!.id == this.correspondantId) {
				this.messages = [...this.messages, msg];
				if (this.scrollToNewMessageAuthorized() || data.sender!.id != this.correspondantId) {
					setTimeout(() => {
						this.scrollToBottom();
					}, 300);
				}
				if (data.sender!.id == this.correspondantId) {
					this.soundsService.play().messageSounds().sentMessage();
				} else {
					this.soundsService.play().messageSounds().receiveMessage();
				}
			}
		});
	}

	public getMessages(): ChatConversationAPIResponseDTO[] {
		return this.messages.sort((a, b) => {
			return a.id < b.id ? -1 : 1;
		});
	}

	public onScroll(event: Event): void {
		if ((event.target as HTMLElement).scrollTop < 50) {
			this.getPrevMessage();
		}
		this.messageToRead();
	}

	private messageToRead(): void {
		const elm: HTMLElement = this.conversationContainer.nativeElement;
		elm.childNodes.forEach((e) => {
			const node = e as HTMLDivElement;
			const id = Number(node.id);
			if (node.getBoundingClientRect) {
				const rect = node.getBoundingClientRect();
				const viewHeight = window.innerHeight || document.documentElement.clientHeight;
				if (rect.y >= 0 && rect.y <= viewHeight) {
					const values = this.getMessages().filter((v) => v.id == id);
					values.forEach((v) => {
						if (v.receiver!.id == this.userId && v.read === false) {
							v.read = true;
							this.chatService
								.readApiMessage(id)
								.pipe(takeUntilDestroyed(this.destroyRef))
								.subscribe(() => {});
						}
					});
				}
			}
		});
	}

	private setCorrespondantDetails(conversation: ChatConversationAPIResponseDTO[], correspondantId: number): void {
		this.correspondantId = correspondantId;
		const _conversation = conversation.find(
			(message) => message.sender!.id === this.correspondantId || message.receiver!.id === this.correspondantId,
		);
		if (_conversation) {
			this.correspondant =
				_conversation.sender!.id === this.correspondantId
					? new Profile({ ..._conversation.sender })
					: new Profile({ ..._conversation.receiver });
			this.correspondantUsername = this.correspondant.username ?? '';
		}
		if (!this.correspondantUsername) {
			this.alert('error', 'Correspondant not found');
			throw new Error('Correspondant not found');
		}
		this.messages = [...conversation];
		const interval = setInterval(() => {
			if (this.getMessages().length == conversation.length) {
				setTimeout(() => {
					if (this.conversationContainer) this.scrollToBottom();
				}, 100);
				clearInterval(interval);
				return;
			}
		}, 10);
	}

	private setAsRead(
		conversation: ChatConversationAPIResponseDTO[],
		userId: number,
	): Observable<ChatSendMessageAPIResponseDTO[]> {
		const unread = conversation
			.filter((message) => message.receiver!.id === userId && !message.read)
			.map((message) => message.id);
		if (unread.length) {
			return from(unread).pipe(
				concatMap((id) => this.chatService.readApiMessage(id)),
				toArray(),
			);
		} else {
			return of([]);
		}
	}

	private watchIsTypping(): void {
		this.chatService.typpingState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
			if (data.userId == this.correspondantId) {
				if (this.timeout != undefined) {
					clearTimeout(this.timeout);
				}
				this.isWriting = data.isTypping;
				this.timeout = setTimeout(() => {
					this.isWriting = false;
				}, 2000);
			}
		});
	}

	private alert(type: string, message: string): void {
		const opts = {
			keepAfterRouteChange: true,
			autoClose: true,
			fade: true,
			open: true,
		};
		switch (type) {
			case 'error':
				this.alertService.error(message, opts);
				break;
			case 'success':
				this.alertService.success(message, opts);
				break;
		}
	}

	public onSendChatCall(type: CallType): void {
		this.callService.sendCall({ type, user: this.correspondant });
	}
}

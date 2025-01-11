import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { AuthService, ChatService, ProfileService } from '@app/shared';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { filter, Observable, switchMap } from 'rxjs';
import { ChatConversationAPIResponseDTO, ReadMessageRTO, UnReadMessageRTO } from '@app/models';
import { broadCastChannel } from '@app/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-footer-action',
	standalone: true,
	imports: [CommonModule, RouterModule, IconComponent],
	templateUrl: './footer-action.component.html',
	styleUrl: './footer-action.component.scss',
})
export class FooterActionComponent implements OnInit {
	private state!: RouterStateSnapshot;
	public newMessage: boolean = false;
	private ownerId: number = 0;
	private unreadMsgStats: UnReadMessageRTO = { total: 0, unreadMessages: [] };
	public icons: { name: string; icon: string; action: () => void }[] = [
		{
			name: 'profile',
			icon: 'profile',
			action: (): void => {
				this.profileAction();
			},
		},
		{
			name: 'navigation',
			icon: 'navigation',
			action: (): void => {
				this.navigationAction();
			},
		},
		{
			name: 'search',
			icon: 'search',
			action: (): void => {
				this.searchAction();
			},
		},
		{
			name: 'message',
			icon: 'message',
			action: (): void => {
				this.messageAction();
			},
		},
		{
			name: 'logout',
			icon: 'logoutSmall',
			action: (): void => {
				this.logoutAction();
			},
		},
	];
	private destroyRef: DestroyRef = inject(DestroyRef);
	public constructor(
		private router: Router,
		private auth: AuthService,
		private changeDetector: ChangeDetectorRef,
		private chatService: ChatService,
		private profileService: ProfileService,
	) {
		this.state = this.router.routerState.snapshot;
		this.listenToRead();
		this.listenToUnread();
	}

	public ngOnInit(): void {
		this.firstRequestAPIToUnread();
	}

	private firstRequestAPIToUnread(): void {
		this.profileService.profile$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				switchMap((payload) => {
					this.ownerId = payload.id;
					this.changeDetector.detectChanges();
					return this.chatService.unreadApiMessage().pipe(takeUntilDestroyed(this.destroyRef));
				}),
				filter((payload) => {
					return payload.total > 0;
				}),
			)
			.subscribe({
				next: (payload) => {
					this.unreadMsgStats = { ...payload };
					this.updateTotalUnread();
				},
			});
	}

	private listenToUnread(): void {
		this.suscribeToUnread(this.chatService.messageUnReadState);
	}

	private suscribeToUnread(ev: Observable<UnReadMessageRTO>): void {
		ev.pipe(
			takeUntilDestroyed(this.destroyRef),
			filter((payload) => {
				return payload.total > 0;
			}),
		).subscribe({
			next: (payload) => {
				this.unreadMsgStats = { ...payload };
				this.updateTotalUnread();
			},
		});
	}

	private listenToRead(): void {
		this.chatService.messageReadState
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				filter(
					(payload) => payload.read && this.unreadMsgStats.total > 0 && Boolean(this.getMsgStats(payload)),
				),
			)
			.subscribe(() => {
				this.unreadMsgStats.total--;
				this.updateTotalUnread();
			});
	}

	private updateTotalUnread(): void {
		this.unreadMsgStats.total > 0 ? (this.newMessage = true) : (this.newMessage = false);
		this.changeDetector.detectChanges();
	}

	private getMsgStats(readMsg: ReadMessageRTO | ChatConversationAPIResponseDTO):
		| {
				userId: number;
				number: number;
		  }
		| undefined {
		return this.unreadMsgStats.unreadMessages?.find(
			(msg) =>
				msg.userId === readMsg?.sender?.id &&
				readMsg?.sender?.id !== this.ownerId &&
				msg.number > 0 &&
				readMsg?.read === false,
		);
	}

	public displayBulle(icon: { name: string; icon: string; action: () => void }): boolean {
		switch (icon.name) {
			case 'profile':
				return this.router.url === '/profile/me' || this.router.url === '/profile/settings';
			case 'navigation':
				return this.router.url === '/browsing' || this.router.url === '/user';
			case 'search':
				return this.router.url === '/research';
			case 'message':
				return this.router.url === '/chat';
			default:
				return false;
		}
	}

	public profileAction(): void {
		this.redirectTo('profile/me');
	}
	public navigationAction(): void {
		this.redirectTo('browsing');
	}
	public searchAction(): void {
		this.redirectTo('research');
	}
	public messageAction(): void {
		this.redirectTo('chat');
	}
	public logoutAction(): void {
		this.auth.logout();
		broadCastChannel.postMessage({ type: 'logout', datas: { from: this.router.url } });
		this.redirectTo('/');
	}

	private redirectTo(route: string): void {
		this.router.navigate([route], {
			state: {
				previousUrl: this.router.url,
				currentUrl: this.state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			},
		});
	}

	public execAction(action: () => void): void {
		action();
	}
}

import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { AlertService, AuthService } from '@app/shared';
import { ButtonNotificationComponent } from '../notification/button/button.component';
import { ModalComponent } from '../modal/modal.component';
import { NotifComponent } from './notif/notif.component';
import { MoreComponent } from './more/more.component';
import { NotifService, ProfileService } from '@app/shared';
import { Notification, NotificationResponseDTO } from '@app/models';
import { catchError, filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { LoaderComponent } from '../loader/loader.component';
import { broadCastChannel } from '@app/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-header-action',
	standalone: true,
	imports: [
		IconComponent,
		CommonModule,
		RouterModule,
		ButtonNotificationComponent,
		ModalComponent,
		NotifComponent,
		MoreComponent,
		LoaderComponent,
	],
	templateUrl: './header-action.component.html',
	styleUrl: './header-action.component.scss',
})
export class HeaderActionComponent implements OnInit {
	@Input() public title: string = 'home';
	@Input() public back: {
		active: boolean;
		title: string;
		location: string;
	} = { active: false, title: '', location: '' };
	@Input() public notif: boolean = false;
	@Input() public more: boolean = false;
	@Input() public logout: boolean = false;
	@Input() public load: boolean = false;

	public toggleNotif: boolean = false;
	public toggleMore: boolean = false;

	protected nbNotifs: number = 0;
	protected notifs: Notification[] = [];
	protected limit: number = 10;
	protected offset: number = 0;
	protected endNotifs: boolean = false;
	protected canScroll: boolean = false;
	private state!: RouterStateSnapshot;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private router: Router,
		private auth: AuthService,
		private profileService: ProfileService,
		private notifService: NotifService,
		private alertService: AlertService,
		private changeDetector: ChangeDetectorRef,
	) {
		this.state = this.router.routerState.snapshot;
		this.suscribeToSocketNbNotifs();
		this.suscribeToSocketNotifs();
	}

	public ngOnInit(): void {
		this.title = this.title || 'home';
		this.back = this.back || { active: false, title: '', location: '' };
		this.notif = this.notif || false;
		this.more = this.more || false;
		this.logout = this.logout || false;

		const url = this.router.url;
		if (!url.match(/registration|recovery\/password|user\/changePasswordByToken|email\/validate|error/)) {
			this.nbNotifsFetch();
		}
	}

	private nbNotifsFetch(): void {
		this.profileService
			.getProfile()
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				switchMap(() => this.notifService.getNbUnreadNotifsApi()),
			)
			.subscribe({
				next: (payload) => {
					this.totalNotifs = payload.numberUnreadNotification;
				},
				error: (error) => {
					this.alert('error', error.error.message);
				},
			});
	}

	private firstNotifsFetch(): void {
		this.profileService
			.getProfile()
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				switchMap(() => this.notifService.getNbUnreadNotifsApi()),
				switchMap((payload) => {
					this.totalNotifs = payload.numberUnreadNotification;
					return this.notifService.getNotifsApiV2(this.limit);
				}),
			)
			.subscribe({
				next: this.suscribeToAPINotifs.bind(this),
				error: (error) => {
					this.alert('error', error.error.message);
				},
			});
	}

	private suscribeToSocketNbNotifs(): void {
		this.notifService.nbNotif$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: (nbNotif) => {
				this.totalNotifs = nbNotif.unread;
			},
		});
	}

	private suscribeToSocketNotifs(): void {
		this.notifService.notif$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: (payload) => {
				const { type, fromUser } = payload;

				if (
					!payload ||
					!type ||
					!fromUser ||
					this.notifs.includes(new Notification(payload)) ||
					this.notifs.filter((notif) => notif.id === payload.id).length > 0
				) {
					return;
				}
				const { username } = fromUser;
				const notif = new Notification(payload);

				if (!(this.router.url.endsWith(`/conversation/${notif.senderId}`) && notif.type === 'MESSAGE')) {
					// ici on neutralise la notification si on est déjà sur la page de conversation
					this.alert('info', `${notif.normalizeTypeNotification()} ${username}`);
				}
				this.notifs = [notif, ...this.notifs];
				this.totalNotifs = this.nbNotifs + 1;
			},
		});
	}

	private suscribeToAPINotifs(payload: NotificationResponseDTO[]): void {
		payload.length < this.limit && (this.endNotifs = true);
		payload.length > 0 && (this.notifs = [...Notification.normalizeArray(payload)]);
		payload.length === this.limit && (this.offset = this.lastOffsetNotifId) && (this.canScroll = true);
		this.changeDetector.detectChanges();
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
			case 'info':
				this.alertService.info(message, opts);
		}
	}

	public backAction(): void {
		this.router.navigate([this.back.location], {
			state: {
				previousUrl: this.router.url,
				currentUrl: this.state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			},
		});
	}

	public notifAction(): void {
		this.toggleNotif = !this.toggleNotif;
		if (this.toggleNotif) {
			this.firstNotifsFetch();
		}
	}

	public moreAction(): void {
		this.toggleMore = !this.toggleMore;
	}

	public logoutAction(): void {
		this.auth.logout();
		broadCastChannel.postMessage({ type: 'logout', datas: { from: this.router.url } });
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

	public onEndAction(): void {
		this.toggleMore = false;
	}

	private get lastOffsetNotifId(): number {
		return this.notifs.length > 0 ? this.notifs[this.notifs.length - 1].id : -1;
	}

	public onScrollNotif(): void {
		if (this.endNotifs) {
			return;
		}
		this.canScroll = false;
		if (this.offset !== -1) {
			this.notifService
				.getNotifsApiV2(this.limit, this.offset)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (payload: NotificationResponseDTO[]) => {
						payload.length < this.limit && (this.endNotifs = true);
						payload.length > 0 && (this.notifs = [...this.notifs, ...Notification.normalizeArray(payload)]);
						payload.length === this.limit &&
							(this.offset = this.lastOffsetNotifId) &&
							(this.canScroll = true);
						this.changeDetector.detectChanges();
					},
					error: (error) => {
						this.alert('error', error.error.message);
					},
				});
		}
	}

	public onDeleteNotif(notif: Notification): void {
		this.notifService
			.deleteNotifApi(notif.id.toString())
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: () => {
					this.notifs = [...this.notifs.filter((n) => n.id !== notif.id)];
					!notif.isRead && (this.totalNotifs = this.nbNotifs - 1);
				},
				error: (error) => {
					this.alert('error', error.error.message);
				},
			});
	}

	public onViewNotifs(notifs: string[]): void {
		forkJoin(
			notifs.map((id) =>
				this.notifService.setNotifAsReadApi(id).pipe(
					filter((payload) => payload instanceof HttpResponse),
					takeUntilDestroyed(this.destroyRef),
					catchError((error) => {
						this.alert('error', error.error.message);
						return of(null);
					}),
				),
			),
		)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: () => {
					this.totalNotifs = this.nbNotifs - notifs.length;
					this.notifs = this.notifs.map((notif) => {
						if (notifs.includes(notif.id.toString())) {
							notif.isRead = true;
						}
						return notif;
					});
				},
				error: (error) => {
					this.alert('error', error.error.message);
				},
				complete: () => {
					this.changeDetector.detectChanges();
				},
			});
	}

	public onActionNotif(notif: Notification): void {
		if (!notif.isRead) {
			this.notifService
				.setNotifAsReadApi(notif.id.toString())
				.pipe(
					filter((payload) => payload instanceof HttpResponse),
					takeUntilDestroyed(this.destroyRef),
				)
				.subscribe({
					next: () => {
						notif.isRead = true;
						this.totalNotifs = this.nbNotifs - 1;
					},
					error: (error) => {
						this.alert('error', error.error.message);
					},
					complete: () => {
						this.changeDetector.detectChanges();
					},
				});
		}

		// Gérer les différents types de notifications
		switch (notif.type) {
			case 'LIKE':
				{
					this.profileService
						.addLike(notif.senderId.toString())
						.pipe(
							catchError((error) => {
								this.alert('error', error.error.message);
								if (error.status === 409) {
									return this.notifService.deleteNotifApi(notif.id.toString()).pipe(
										tap(() => {
											this.notifs = [...this.notifs.filter((n) => n.id !== notif.id)];
											!notif.isRead && (this.totalNotifs = this.nbNotifs - 1);
										}),
										map(() => null),
									);
								}
								return of(null);
							}),
						)
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe({
							next: () => {},
							error: (error) => {
								this.alert('error', error.error.message);
							},
							complete: () => {
								this.changeDetector.detectChanges();
							},
						});
				}
				break;
			case 'UNLIKE':
			case 'VIEW':
				this.router.navigate(['/profile', notif.senderId], {
					state: {
						previousUrl: this.router.url,
						currentUrl: this.state.url,
						code: 200,
						status: 'OK',
						message: 'Authorized',
					},
				});
				return;
			case 'MATCH':
			case 'MESSAGE':
				this.router.navigate(['/chat/conversation', notif.senderId], {
					state: {
						previousUrl: this.router.url,
						currentUrl: this.state.url,
						code: 200,
						status: 'OK',
						message: 'Authorized',
					},
				});
				return;
			case 'EVENT_ACCEPTED':
			case 'EVENT_REFUSE':
			case 'NEW_EVENT':
				this.router.navigate([`/event`], {
					queryParams: { tab: 'list' },
					// fragment: `event-${notif.id}`, // -> me manque l'id de l'event pour le gerer avec le fragment
					state: {
						tab: 'list',
						event: notif.id,
						previousUrl: this.router.url,
						currentUrl: this.state.url,
						code: 200,
						status: 'OK',
						message: 'Authorized',
					},
				});
				return;
			default:
				return;
		}
	}

	private set totalNotifs(nb: number) {
		this.nbNotifs = nb < 0 ? 0 : nb;
		this.changeDetector.detectChanges();
	}
}

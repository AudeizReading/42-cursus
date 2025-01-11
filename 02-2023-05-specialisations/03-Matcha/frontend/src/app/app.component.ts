import { AfterViewInit, Component, DestroyRef, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
	AlertService,
	ChatService,
	GeolocationService,
	ProfileService,
	SocketService,
	StorageService,
} from '@app/shared/';
import { AlertComponent } from '@app/components';
import { ModeType, WindowComponent } from './components/chat/window/window.component';
import {
	AlertFacade,
	CallType,
	isFacebookMe,
	isGoogleMe,
	isOauthProviderDTO,
	Profile,
	ProfileDTO,
	ReceiveCallRTO,
} from './models';
import { CallService } from './shared/services/call/call.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, AlertComponent, WindowComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent extends AlertFacade implements AfterViewInit {
	public title = 'frontend';

	protected call: boolean = false;
	protected mode: ModeType = 'SEND_AUDIO';
	protected username: string = '';
	protected userId: number = -1;
	protected userPictureUrl: string = '';
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private readonly storageService: StorageService,
		private readonly socketService: SocketService,
		private readonly chatService: ChatService,
		private readonly callService: CallService,
		private readonly geolocationService: GeolocationService,
		private readonly profileService: ProfileService,
		alertService: AlertService,
	) {
		super(alertService);

		this.socketService.init();

		this.chatService.callState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: (event: ReceiveCallRTO) => {
				if (event.user) {
					this.onReceive(event.type, event.user);
				}
			},
		});
		this.chatService.endCallState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: () => {
				this.mode = 'END';
			},
		});
		this.callService.callData.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((call) => {
			if (call != null) {
				this.onSendCall(call.type, call.user);
			}
		});
	}

	protected checkGeoPermission(): void {
		this.geolocationService.geoPermission
			.then((perm) => {
				if (perm.state === 'denied') {
					this.geolocationService.stopTracking();
				} else if (perm.state === 'prompt' || perm.state === 'granted') {
					this.geolocationService.startTracking();
				}
			})
			.catch((error) => {
				throw error;
			});
	}

	public ngAfterViewInit(): void {
		if (this.storageService.isAuth()) {
			this.checkGeoPermission();
		}
	}

	@HostListener('window:storage', ['$event'])
	protected onStorageUpdate(event: StorageEvent): void {
		if (event.key === 'oauth') {
			if (event.newValue) {
				const datas = JSON.parse(event.newValue);
				if ('access_token' in datas || isOauthProviderDTO(datas)) {
					if (isFacebookMe(datas)) {
						this.storageService.saveOauth({ type: 'facebook', datas });
					} else if (isGoogleMe(datas)) {
						this.storageService.saveOauth({ type: 'google', datas });
					} else if ('access_token' in datas) {
						this.storageService.saveOauth(datas);
					}
					this.profileService
						.getProfileStatus()
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe({
							next: (status) => {
								if (Object.values(status).every((s) => s === true)) {
									this.checkGeoPermission();
								}
							},
						});
				}
			}
		}
	}

	public closeWindow(): void {
		this.call = false;
	}

	public onSendCall(type: CallType, user: Profile): void {
		switch (type) {
			case 'AUDIO':
				this.mode = 'SEND_AUDIO';
				break;
			case 'VIDEO':
				this.mode = 'SEND_VIDEO';
				break;
		}
		this.username = user!.username as string;
		this.userPictureUrl = user.defaultPicture?.url as string;
		this.userId = user.id as number;
		this.call = true;
	}

	public onReceive(type: CallType, user: ProfileDTO): void {
		switch (type) {
			case 'AUDIO':
				this.mode = 'RECEIPE_AUDIO';
				break;
			case 'VIDEO':
				this.mode = 'RECEIPE_VIDEO';
				break;
		}
		this.username = user.username;
		this.userPictureUrl = user.defaultPicture.url;
		this.userId = user.id;
		this.call = true;
	}
}

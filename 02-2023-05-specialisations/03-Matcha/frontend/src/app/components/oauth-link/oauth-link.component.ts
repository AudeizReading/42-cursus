import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import {
	isFacebookMe,
	isGoogleMe,
	OauthBase,
	OauthSocialMediaTypes,
	OauthStatusDTO,
	WindowSettings,
} from '@app/models';
import { AlertService, CapitalizePipe, OauthService } from '@app/shared';
import { WindowComponent } from '../window/window.component';

@Component({
	selector: 'app-oauth-link',
	standalone: true,
	imports: [CapitalizePipe, WindowComponent],
	templateUrl: './oauth-link.component.html',
	styleUrl: './oauth-link.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OauthLinkComponent extends OauthBase implements OnInit {
	public _settings!: WindowSettings;
	@Input({ required: true })
	public oauthType!: OauthSocialMediaTypes;

	@Input()
	public oauthDatas!: OauthStatusDTO | undefined;
	public connect: boolean = false;
	public constructor(
		alertService: AlertService,
		oauthService: OauthService,
		private cdr: ChangeDetectorRef,
	) {
		super(alertService, oauthService, 'width=800,height=600');
	}
	public ngOnInit(): void {
		this.getOauthBaseDatas(this.oauthType, true);
		if (this.oauthDatas !== undefined) {
			this.oauthStatus = this.oauthDatas;
			this.connect = true;
			this.cdr.detectChanges();
		}
	}

	protected onUnlink(): void {
		if (this.oauthDatas) {
			this.unLinkAccount(() => {
				this.connect = false;
				this.cdr.detectChanges();
			});
		}
	}

	protected onLink(): void {
		if (this.oauthType && this.settings) {
			this._settings = { ...this.settings };
			this.cdr.detectChanges();
		}
	}

	@HostListener('window:storage', ['$event'])
	protected onStorageUpdate(event: StorageEvent): void {
		if (event.key === 'oauth') {
			if (event.newValue) {
				const datas = JSON.parse(event.newValue);
				if ('error' in datas) {
					this.alert('error', datas.error);
					window.localStorage.removeItem('oauth');
				} else if (
					(isGoogleMe(datas) && this.oauthType === 'google') ||
					(isFacebookMe(datas) && this.oauthType === 'facebook')
				) {
					const oauth = {
						type: this.oauthType,
						next: (): void => {
							this.connect = true;
							this.cdr.detectChanges();
						},
						providerDatas: datas,
					};
					this.linkAccount(oauth);
				}
			}
		}
	}
}

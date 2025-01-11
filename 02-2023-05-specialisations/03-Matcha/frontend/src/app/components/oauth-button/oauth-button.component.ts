import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { AlertService, CapitalizePipe, OauthService } from '@app/shared';
import { OauthBase, OauthSocialMediaTypes, WindowSettings } from '@app/models';
import { WindowComponent } from '../window/window.component';

@Component({
	selector: 'app-oauth-button',
	standalone: true,
	imports: [CommonModule, CapitalizePipe, WindowComponent],
	templateUrl: './oauth-button.component.html',
	styleUrl: './oauth-button.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OauthButtonComponent extends OauthBase implements AfterViewInit {
	@Input() public oauthType!: OauthSocialMediaTypes;
	public _settings!: WindowSettings;

	public constructor(
		alertService: AlertService,
		oauthService: OauthService,
		private cdr: ChangeDetectorRef,
	) {
		super(alertService, oauthService, 'width=800,height=600');
	}

	public ngAfterViewInit(): void {
		this.getOauthBaseDatas(this.oauthType);
	}

	public onClick(): void {
		if (this.oauthType && this.settings) {
			this._settings = { ...this.settings };
			this.cdr.detectChanges();
		}
	}
}

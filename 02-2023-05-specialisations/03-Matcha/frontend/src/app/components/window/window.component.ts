import { CdkPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WindowSettings } from '@app/models';

@Component({
	selector: 'app-window',
	standalone: true,
	imports: [],
	templateUrl: './window.component.html',
	styleUrl: './window.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WindowComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() public settings!: WindowSettings;

	@ViewChild(CdkPortal) public portal!: CdkPortal;
	private window: Window | null = null;
	private portalOutlet: DomPortalOutlet | null = null;

	public ngOnInit(): void {
		this.openExternalWindow();
	}

	public ngAfterViewInit(): void {
		if (this.window && this.window.document && this.portal) {
			this.portalOutlet = new DomPortalOutlet(this.window.document.body);
			this.portalOutlet.attach(this.portal);
		}
	}

	public ngOnDestroy(): void {
		this.closeExternalWindow();
	}

	private openExternalWindow(): void {
		if (this.settings && this.settings.url && this.settings.name) {
			this.window = window.open(this.settings.url, this.settings.name, this.settings.options);
			if (!this.window) {
				throw new Error('Window not opened');
			}
		}
	}

	private closeExternalWindow(): void {
		if (this.portalOutlet) {
			this.portalOutlet.detach();
		}

		if (this.window) {
			this.window.close();
			this.window = null;
		}
	}
}

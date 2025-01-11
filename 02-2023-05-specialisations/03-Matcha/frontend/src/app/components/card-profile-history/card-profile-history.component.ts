import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

@Component({
	selector: 'app-card-profile-history',
	standalone: true,
	imports: [RouterModule, TooltipModule],
	templateUrl: './card-profile-history.component.html',
	styleUrl: './card-profile-history.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProfileHistoryComponent implements OnInit {
	@Input() public urlPicture!: string;
	@Input() public username!: string;
	@Input() public userId!: string;
	@Input() public count?: number;
	protected state!: RouterStateSnapshot;

	public constructor(protected router: Router) {
		this.state = this.router.routerState.snapshot;
	}

	public ngOnInit(): void {
		if (!this.count) {
			this.count = 1;
		}
	}
}

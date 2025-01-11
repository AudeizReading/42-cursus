import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Alert } from '@app/models';
import { AlertService } from '@app/shared';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NotificationPopupComponent } from '../notification/popup/popup.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-alert',
	standalone: true,
	imports: [CommonModule, NotificationPopupComponent],
	templateUrl: './alert.component.html',
	styleUrl: './alert.component.scss',
	animations: [
		trigger('fade', [
			state(
				'open',
				style({
					opacity: 1,
					transform: 'translateY(0) scale(1) rotateY(0)',
					filter: 'blur(0) saturate(1)',
				}),
			),
			state(
				'closed',
				style({
					opacity: 0,
					transform: 'translateY(20px) scale(1.1) rotateY(5deg)',
					filter: 'blur(2px) saturate(0.5)',
				}),
			),
			transition('closed => open', [animate('3s 2s ease-in')]),
			transition('open => closed', [animate('2s 3s ease-out')]),
		]),
	],
})
export class AlertComponent implements OnInit {
	@Input() public id: string;

	public alerts: Alert[];
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private alertService: AlertService,
		private router: Router,
	) {
		this.id = 'default-alert';
		this.alerts = [];
	}

	public ngOnInit(): void {
		this.id = 'default-alert';
		this.alerts = [];

		this.alertService
			.onAlert(this.id)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((alert) => {
				// nettoyage des alertes si une alerte vide est recue
				if (!alert.message) {
					this.alerts = this.alerts.filter((x) => x.keepAfterRouteChange);
					this.alerts.forEach((x) => delete x.keepAfterRouteChange);
					return;
				}

				this.alerts.push(alert);
				if (alert.autoClose) {
					setTimeout(() => this.removeAlert(alert), 3000);
				}
			});

		// nettoyage des alertes lors du changement de route
		this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.alertService.clear(this.id);
			}
		});
	}

	public onAction(alert: Alert): void {
		if (alert.action) alert.action();
	}

	public removeAlert(alert: Alert): void {
		if (!this.alerts.includes(alert)) {
			return;
		}

		if (alert.fade) {
			this.alerts.find((x) => x === alert)!.fade = true;
		}
		setTimeout(() => {
			this.alerts = this.alerts.filter((x) => x !== alert);
			alert!.open = false;
		}, 0);
	}
}

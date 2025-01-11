import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
	selector: 'app-badge',
	standalone: true,
	imports: [IconComponent, CommonModule],
	templateUrl: './badge.component.html',
	styleUrl: './badge.component.scss',
})
export class BadgeComponent {
	@Input() public badge: string = 'bisexual';
	@Input() public badgeClasses: string = 'bisexual';

	public constructor() {}
}

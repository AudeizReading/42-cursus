import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-settings',
	standalone: true,
	imports: [],
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
	@Input() public color: string = 'white';
}

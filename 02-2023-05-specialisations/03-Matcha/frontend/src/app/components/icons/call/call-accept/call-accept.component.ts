import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-call-accept',
	standalone: true,
	imports: [],
	templateUrl: './call-accept.component.html',
	styleUrl: './call-accept.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallAcceptComponent {}

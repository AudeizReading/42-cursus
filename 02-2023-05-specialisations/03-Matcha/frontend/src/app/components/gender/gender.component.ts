import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Gender } from '@app/models';
import { GenderService } from '@app/shared';

@Component({
	selector: 'app-gender',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './gender.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderComponent {
	@Input() public gender?: Gender;
	@Input() public update?: boolean = false;
	@Input() public _delete?: boolean = false;

	public constructor(private genderService: GenderService) {}
}

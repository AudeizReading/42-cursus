import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-favorite',
	standalone: true,
	imports: [],
	templateUrl: './favorite.component.html',
	styleUrl: './favorite.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteComponent {
	@Input() public color: string = 'white';
}

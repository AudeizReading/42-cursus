import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-progress-bar',
	standalone: true,
	imports: [],
	templateUrl: './progress-bar.component.html',
	styleUrl: './progress-bar.component.scss',
	animations: [
		trigger('progress', [
			state('start', style({ opacity: 1 })),
			state('end', style({ opacity: 0 })),
			transition('start => end', [animate('2s ease-in-out')]),
			transition('end => start', [animate('4s ease-in-out')]),
		]),
	],
})
export class ProgressBarComponent implements OnInit, OnChanges {
	@Input() public progress!: number;
	@Input() public hide!: boolean;

	public constructor() {
		this.progress = this.progress || 0;
		this.hide = this.hide || false;
	}
	public ngOnInit(): void {
		this.progress = this.progress || 0;
		this.hide = this.hide || false;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['progress'] && changes['progress'].currentValue !== changes['progress'].previousValue) {
			this.progress = changes['progress'].currentValue || changes['progress'].previousValue || 0;
		}
		if (changes['hide'] && changes['hide'].currentValue !== changes['hide'].previousValue) {
			this.hide = changes['hide'].currentValue || changes['hide'].previousValue || false;
		}
	}
}

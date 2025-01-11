import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[appClickStopPropagation]',
	standalone: true,
})
export class ClickStopPropagationDirective {
	public constructor() {}

	@HostListener('click', ['$event'])
	public onClick(event: Event): void {
		event.stopPropagation();
	}
}

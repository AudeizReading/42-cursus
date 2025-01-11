import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
	selector: '[appScrollend]',
	standalone: true,
})
export class ScrollendDirective {
	@Output() public notifyScrollEnd: EventEmitter<string> = new EventEmitter<string>();
	@Input() public threshold: number = 0.8;
	public constructor(
		private readonly renderer: Renderer2,
		private readonly el: ElementRef,
	) {}
	@HostListener('scrollend', ['$event'])
	public onScroll(): void {
		const computePercentScroll = (scroll: number, height: number, clientHeight: number): number => {
			return scroll / (height - clientHeight);
		};
		if (
			computePercentScroll(
				this.el.nativeElement.scrollTop,
				this.el.nativeElement.scrollHeight,
				this.el.nativeElement.clientHeight,
			) >= this.threshold
		) {
			this.notifyScrollEnd.emit(this.el.nativeElement.id);
		}
	}
}

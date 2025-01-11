import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
	selector: '[appGridProfileDetails]',
	standalone: true,
})
export class GridProfileDetailsDirective implements AfterViewInit {
	private tagsHeight: number = 0;
	public constructor(
		private readonly el: ElementRef,
		private readonly renderer: Renderer2,
	) {}

	public ngAfterViewInit(): void {
		this.resize();
	}

	private resize(): string {
		const tags = (this.el.nativeElement as HTMLElement).querySelector('#profile-details-tags');
		if (tags) {
			this.tagsHeight = tags.clientHeight;
			this.renderer.setStyle(
				this.el.nativeElement,
				'grid-template-rows',
				`2.25rem 1.1rem 1.15rem ${this.tagsHeight + 15}px 2rem auto auto `,
			);

			return `2.25rem 1.1rem 1.15rem  ${this.tagsHeight + 15}px 2rem auto auto `;
		}
		return `2.25rem 1.1rem 1.15rem  auto 2rem auto auto `;
	}

	@HostBinding('style.grid-template-rows') public get setHeight(): string {
		return this.resize();
	}

	@HostListener('window:resize', ['$event']) public onResize(): void {
		this.resize();
	}
}

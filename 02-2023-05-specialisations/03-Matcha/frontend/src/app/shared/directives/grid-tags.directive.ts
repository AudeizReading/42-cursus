// https://blog.exceptionfound.com/2019/05/06/css-grid-with-angular-directives/
import {
	ChangeDetectorRef,
	Directive,
	ElementRef,
	HostBinding,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	Renderer2,
	SimpleChanges,
} from '@angular/core';

@Directive({
	selector: '[appGridTags]',
	standalone: true,
})
export class GridTagsDirective implements OnInit, OnChanges {
	@Input() public nbTags!: number;
	private readonly tagHeight: number = 30;
	private readonly tagWidth: number = 77;
	public constructor(
		private readonly el: ElementRef,
		private readonly renderer: Renderer2,
		private readonly changeDetector: ChangeDetectorRef,
	) {
		this.setStyle();
	}

	public ngOnInit(): void {
		if (!this.nbTags) {
			return;
		}
		this.setStyle();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['nbTags'] && changes['nbTags'].currentValue !== changes['nbTags'].previousValue) {
			this.nbTags = changes['nbTags'].currentValue;
			this.setStyle();
			this.changeDetector.detectChanges();
		}
	}

	private setStyle(): void {
		this.renderer.setStyle(this.el.nativeElement, 'display', `grid`);
		this.renderer.setStyle(this.el.nativeElement, 'height', this.height);
		this.renderer.setStyle(this.el.nativeElement, 'max-height', this.viewportMaxHeight);
		this.renderer.setStyle(this.el.nativeElement, 'grid-template-rows', this.gridTemplateRows);
		this.renderer.setStyle(this.el.nativeElement, 'grid-template-columns', this.gridTemplateCols);
	}

	private get rows(): number {
		const rows = Math.ceil(this.nbTags / this.cols);
		return rows > this.maxRows ? this.maxRows : rows;
	}

	private get maxRows(): number {
		const maxVp = this.viewportMaxHeight;
		switch (maxVp) {
			case '90px':
				return 3;
			case '180px':
				return 6;
		}
		return 0;
	}

	private get cols(): number {
		return Math.floor(this.deviceWidth / this.tagWidth);
	}

	private get deviceWidth(): number {
		const parent = this.renderer.parentNode(this.el.nativeElement);
		const isProfileDetailsSection = parent.classList.contains('profile-details-section');

		return isProfileDetailsSection
			? window.innerWidth > 1200
				? 1200
				: window.innerWidth - 20
			: window.innerWidth < 400
				? window.innerWidth * 0.9
				: 330;
	}

	@HostBinding('syle.max-height') public get viewportMaxHeight(): string {
		const parent = this.renderer.parentNode(this.el.nativeElement);
		const isProfileDetailsSection = parent.classList.contains('profile-details-section');
		return isProfileDetailsSection ? '90px' : '180px';
	}

	@HostBinding('style.grid-template-rows') public get gridTemplateRows(): string {
		return `repeat(${this.rows}, 1fr)`;
	}

	@HostBinding('style.grid-template-columns') public get gridTemplateCols(): string {
		return `repeat(${this.cols}, 1fr)`;
	}

	@HostBinding('style.height') public get height(): string {
		return `${this.rows * this.tagHeight}px`;
	}

	@HostListener('window:resize', ['$event']) public onResize(): void {
		this.setStyle();
	}
}

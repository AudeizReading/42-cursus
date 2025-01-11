import { Component, Input, OnInit } from '@angular/core';
import { FooterComponent, HeaderComponent } from '@app/components';

@Component({
	selector: 'app-layout',
	standalone: true,
	imports: [HeaderComponent, FooterComponent],
	templateUrl: './layout.component.html',
	styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
	@Input()
	public headerClasses?: string;
	@Input()
	public footerClasses?: string;
	@Input()
	public btnClasses?: string;
	@Input()
	public footerLink?: string;
	@Input()
	public shadow: boolean = true;

	public constructor() {
		this.headerClasses = this.headerClasses || '';
		this.footerClasses = this.footerClasses || '';
		this.btnClasses = this.btnClasses || '';
		this.footerLink = this.footerLink || '';
	}

	public ngOnInit(): void {
		this.headerClasses = this.headerClasses || '';
		this.footerClasses = this.footerClasses || '';
		this.btnClasses = this.btnClasses || '';
		this.footerLink = this.footerLink || '';
	}
}

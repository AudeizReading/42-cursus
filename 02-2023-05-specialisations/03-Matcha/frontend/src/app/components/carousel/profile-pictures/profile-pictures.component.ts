import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FileDTO } from '@app/models';

@Component({
	selector: 'app-profile-pictures',
	standalone: true,
	imports: [],
	templateUrl: './profile-pictures.component.html',
	styleUrl: './profile-pictures.component.scss',
})
export class ProfilePicturesComponent implements OnInit, OnChanges {
	@Input() public pictures!: FileDTO[];
	public currentSlide: number;
	public openModal: boolean = false;

	public constructor() {
		this.currentSlide = 0;
	}

	public ngOnInit(): void {
		this.currentSlide = 0;
	}
	public ngOnChanges(changes: SimpleChanges): void {
		if (
			'currentSlide' in changes &&
			changes['currentSlide'].currentValue !== changes['currentSlide'].previousValue
		) {
			this.currentSlide = changes['currentSlide'].currentValue;
		}
	}

	@HostListener('window:keydown', ['$event'])
	public handleKeyDown(event: KeyboardEvent): void {
		if (!this.openModal) {
			return;
		}

		switch (event.key) {
			case 'ArrowLeft':
				this.onPrev();
				break;
			case 'ArrowRight':
				this.onNext();
				break;
			case 'Escape':
				this.onClosePicture();
				break;
		}
	}

	public onClick(index: number): void {
		if (index < 0 || index >= this.pictures.length) this.currentSlide = 0;
		else this.currentSlide = index;
	}

	public onOpenPicture(): void {
		this.openModal = true;
	}

	public onClosePicture(): void {
		this.openModal = false;
	}

	public onPrev(): void {
		if (this.pictures.length <= 1) return;
		if (this.currentSlide <= 0) {
			this.currentSlide = this.pictures.length - 1;
			return;
		}
		this.currentSlide -= 1;
	}

	public onNext(): void {
		if (this.pictures.length <= 1) return;
		if (this.currentSlide + 1 >= this.pictures.length) {
			this.currentSlide = 0;
			return;
		}
		this.currentSlide += 1;
	}
}

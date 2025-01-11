import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import {
	PicturePreviewAction,
	PicturePreviewComponent,
	PicturePreviewConfig,
	PreviewPlaceholderComponent,
} from '../..';

@Component({
	selector: 'app-auxiliary-preview',
	standalone: true,
	imports: [PicturePreviewComponent, PreviewPlaceholderComponent],
	templateUrl: './auxiliary-preview.component.html',
	styleUrl: './auxiliary-preview.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuxiliaryPreviewComponent implements OnInit, OnChanges {
	@Input() public pictures: PicturePreviewConfig[] = [];
	@Output() public clickAction: EventEmitter<PicturePreviewAction> = new EventEmitter<PicturePreviewAction>();
	private max: number = 4;

	public constructor(private cdr: ChangeDetectorRef) {}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['pictures'] && changes['pictures'].currentValue !== changes['pictures'].previousValue) {
			// TODO: bizarre que ca fonctionne sans ca la maj des données
			// this.pictures = [...changes['pictures'].currentValue];
			this.adjustPictures();
		}
	}

	public ngOnInit(): void {
		this.adjustPictures();
	}

	protected adjustPictures(): void {
		if (this.pictures?.length > this.max) {
			this.pictures = this.pictures.slice(0, this.max);
		} else if (this.pictures?.length) {
			const old = this.pictures?.length;
			for (let i = 0; this.pictures?.length < this.max; ++i) {
				this.pictures?.push({ role: 'aux', url: '', id: i + old + 1, name: 'placeholder' });
			}
		}
		this.pictures = this.pictures?.length > 0 ? [...this.pictures] : [];
		this.cdr.detectChanges();
	}

	protected onClick(config: PicturePreviewAction): void {
		this.clickAction.emit(config);
	}
}

import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	EventEmitter,
	inject,
	Input,
	Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TagComponent } from '@app/components/tag/tag.component';
import { ITag } from '@app/models';
import { AlertService, TagService } from '@app/shared';
import { debounceTime, Subject } from 'rxjs';

@Component({
	selector: 'app-tag-search',
	standalone: true,
	imports: [TagComponent],
	templateUrl: './tag.component.html',
	styleUrl: './tag.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchTagComponent {
	@Input() public create: boolean = true;

	private searchTag = new Subject<string>();
	public searchString = '';
	public tags: ITag[] = [];
	public inputHtml: HTMLInputElement | undefined = undefined;
	private destroyRef: DestroyRef = inject(DestroyRef);

	@Output() public selectedTag: EventEmitter<ITag> = new EventEmitter<ITag>();

	public constructor(
		private readonly changeDetector: ChangeDetectorRef,
		private readonly tagService: TagService,
		private readonly alertService: AlertService,
	) {
		this.searchTag.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
			this.search(value);
		});
	}

	public tagExist(): boolean {
		return this.tags.filter((v) => v.name === this.searchString).length >= 1;
	}

	public onChange(event: Event): void {
		this.inputHtml = event.target as HTMLInputElement;
		const inputValue = this.inputHtml.value;
		this.searchTag.next(inputValue);
	}

	private error(message: string): void {
		const opts = {
			keepAfterRouteChange: true,
			autoClose: true,
			fade: true,
			open: true,
		};
		this.alertService.error(message, opts);
	}

	public onCreate(): void {
		this.tagService
			.createTag(this.searchString)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (tag) => {
					if (tag?.tag) this.onClick(tag.tag, false);
				},
				error: (error) => {
					this.error(error.error.message);
				},
			});
	}

	private search(value: string): void {
		this.tagService
			.getTags({ limit: 10, search: value })
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((v) => {
				this.searchString = value;
				if (value === '') this.getResult([]);
				else this.getResult(v?.results);
			});
	}

	private getResult(values: ITag[]): void {
		this.tags = values;
		this.changeDetector.detectChanges();
	}

	public onClick(tag: ITag, newTag: boolean = true): void {
		if (tag) {
			if (this.create && newTag) {
				this.tagService
					.createTag(tag.name)
					.pipe(takeUntilDestroyed(this.destroyRef))
					.subscribe({
						next: () => {},
						error: (error) => {
							this.error(error.error.message);
						},
					});
			}
			this.selectedTag.emit(tag);
			this.searchString = '';
			this.tags = [];
			if (this.inputHtml) {
				this.inputHtml.value = '';
			}
			this.changeDetector.detectChanges();
		}
	}
}

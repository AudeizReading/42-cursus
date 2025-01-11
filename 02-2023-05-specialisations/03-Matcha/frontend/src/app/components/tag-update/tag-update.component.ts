import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, Input } from '@angular/core';
import { SearchTagComponent } from '../search/tag/tag.component';
import { TagComponent } from '../tag/tag.component';
import { ITag } from '@app/models';
import { ProfileService } from '@app/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-tag-update',
	standalone: true,
	imports: [SearchTagComponent, TagComponent],
	templateUrl: './tag-update.component.html',
	styleUrl: './tag-update.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagUpdateComponent {
	@Input()
	public removeLast: boolean = true;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public tags: ITag[] = [];

	public constructor(
		private readonly profileService: ProfileService,
		private changeDetector: ChangeDetectorRef,
	) {
		this.profileService
			.getProfile()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((profile) => {
				this.tags = profile.tags && profile.tags.length > 0 ? [...profile.tags] : [];
				this.changeDetector.detectChanges();
			});
	}

	public addTag(tag: ITag): void {
		if (!this.tags.includes(tag)) this.tags = [...this.tags, tag];
	}

	public onDeleteTag(tagName: string): void {
		this.tags = this.tags.filter((v) => v.name != tagName);
	}
}

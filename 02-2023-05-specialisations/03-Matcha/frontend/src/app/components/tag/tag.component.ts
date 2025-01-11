import {
	Component,
	DestroyRef,
	EventEmitter,
	inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { AlertService, TagService, TruncatePipe } from '@app/shared';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-tag',
	standalone: true,
	imports: [IconComponent, CommonModule, TruncatePipe],
	templateUrl: './tag.component.html',
	styleUrl: './tag.component.scss',
})
export class TagComponent implements OnInit, OnChanges {
	@Input() public tag!: string | null;
	@Input() public canDelete: boolean = false;
	@Input() public canAdd: boolean = false;
	@Input() public emitDelete: boolean = false;
	@Input() public realDelete: boolean = true;
	@Output() public action: EventEmitter<string> = new EventEmitter<string>();
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private tagService: TagService,
		private alertService: AlertService,
	) {
		this.tag = this.tag || null;
	}

	public ngOnInit(): void {
		this.tag = this.tag || null;
		if (this.canAdd && this.tag) {
			this.addTag(this.tag);
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['tag'] && changes['tag'].currentValue !== changes['tag'].previousValue) {
			this.tag = changes['tag'].currentValue;
		}
	}

	public deleteTag(tag: string): void {
		if (this.tag && this.canDelete) {
			if (this.emitDelete) {
				this.action.emit(this.tag);
			}
			if (this.realDelete) {
				this.tagService
					.deleteTag(tag)
					.pipe(takeUntilDestroyed(this.destroyRef))
					.subscribe({
						next: this.response(null).bind(this),
						error: this.error.bind(this),
					});
			}
		}
	}

	public addTag(tag: string): void {
		if (tag !== undefined) {
			this.tagService
				.createTag(tag)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: this.response(tag).bind(this),
					error: this.error.bind(this),
				});
		}
	}

	public updateTag(tag: string): void {
		if (this.tag && this.canDelete) {
			this.tagService
				.deleteTag(tag)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: () => {
						this.addTag(tag);
					},
					error: this.error.bind(this),
				});
		}
	}

	private alert(type: string, message: string): void {
		const opts = {
			keepAfterRouteChange: true,
			autoClose: true,
			fade: true,
			open: true,
		};
		switch (type) {
			case 'error':
				this.alertService.error(message, opts);
				break;
			case 'success':
				this.alertService.success(message, opts);
				break;
		}
	}

	private response(value: string | null): (response: HttpResponse<unknown> | unknown) => void {
		return (response) => {
			if (response instanceof HttpResponse) {
				this.alert('success', response.body.message);
				const old = this.tag;
				this.tag = value;
				let msg = '';
				if (old && value) {
					msg = `Created:${this.tag}`;
				} else if (old) {
					msg = `Deleted:${old}`;
				} else {
					msg = `Created:${this.tag}`;
				}
				this.action.emit(msg);
			}
		};
	}

	private error(error: { error: { message: string } }): void {
		this.alert('error', error.error.message);
		this.action.emit(`Error:${this.tag}`);
		this.tag = null;
	}
}

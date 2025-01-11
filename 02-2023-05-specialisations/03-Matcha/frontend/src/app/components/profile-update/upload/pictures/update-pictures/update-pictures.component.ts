import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import {
	PicturePreviewAction,
	PicturePreviewConfig,
	PicturePreviewRole,
	PreviewContainerComponent,
	UploadPicturesComponent,
} from '../../../index';
import { AlertService, FileService, ProfileService, UserService } from '@app/shared';
import { AlertFacade, FilePreview, Profile } from '@app/models';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-update-pictures',
	standalone: true,
	imports: [PreviewContainerComponent, UploadPicturesComponent],
	templateUrl: './update-pictures.component.html',
	styleUrl: './update-pictures.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePicturesComponent extends AlertFacade implements OnInit, OnChanges {
	@Input() public main!: PicturePreviewConfig;
	@Input() public aux!: PicturePreviewConfig[];

	protected pendingPreview: PicturePreviewConfig | undefined;
	protected profile!: Profile;
	protected opened: boolean = false;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private cdr: ChangeDetectorRef,
		private fileService: FileService,
		private userService: UserService,
		alertService: AlertService,
		private profileService: ProfileService,
	) {
		super(alertService);
	}

	public ngOnInit(): void {
		this.profileService.profile$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((profile) => {
			this.profile = new Profile(profile);
			this.main = this.profile.defaultPicturePreview;
			this.aux = this.profile.auxPicturesPreview;
			this.cdr.detectChanges();
		});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['main'] && changes['main'].currentValue !== changes['main'].previousValue) {
			this.main = { ...changes['main'].currentValue };
			this.cdr.detectChanges();
		}
		if (changes['aux'] && changes['aux'].currentValue !== changes['aux'].previousValue) {
			this.aux = [...changes['aux'].currentValue];
			this.cdr.detectChanges();
		}
	}

	public onSave(previews: { file: File; preview: FilePreview }[]): void {
		this.isOpen = false;
		const { file } = previews[0];
		this.addFile(file);
	}

	public onPreviewClick(e: PicturePreviewAction): void {
		if (e.action === 'placeholder' && !this.opened) {
			this.isOpen = true;
			this.pendingPreview = { ...e.config };
		} else if (e.action === 'delete') {
			this.removeFileFromAPI(e.config);
		} else if (e.action === 'choose' && e.config.name !== 'placeholder') {
			this.setAsProfilePictureAPI(e.config);
		}
	}

	public onExit(): void {
		this.isOpen = false;
	}

	private set isOpen(value: boolean) {
		this.opened = value;
		this.cdr.detectChanges();
	}

	private get totalPlaceholders(): number {
		const old = this.aux.length + 1;
		const main = this.main.name === 'placeholder' ? 1 : 0;
		const aux = this.aux.filter((a) => a.name === 'placeholder').length;
		const total = old < 5 ? 5 - old + main + aux : main + aux;
		return total;
	}

	private swapFiles(e: PicturePreviewConfig): PicturePreviewConfig {
		const old = { ...this.main, role: 'aux' as PicturePreviewRole };
		this.main = { ...e, role: 'main' };
		return old;
	}

	private getFormData(file: File): FormData {
		const formData = new FormData();
		formData.append('file', file, file.name);
		return formData;
	}

	private saveUpload(preview: PicturePreviewConfig): void {
		if (this.pendingPreview) {
			if (this.main.id === this.pendingPreview.id && this.main.url === this.pendingPreview.url) {
				this.swapFiles({
					url: preview.url,
					id: preview.id,
					name: preview.name,
					role: 'main',
				});
				this.main = { ...this.main };
				this.cdr.detectChanges();
			} else {
				const aux = this.aux.find((a) => a.id === this.pendingPreview!.id);

				if (aux) {
					aux.url = preview.url;
					aux.id = preview.id;
					aux.name = preview.name;
					aux.role = 'aux';
					this.aux = [
						...this.aux.reduce((acc, a) => {
							if (a.id === this.pendingPreview!.id && a.url === this.pendingPreview!.url && aux)
								acc.push(aux);
							else acc.push(a);
							return acc;
						}, [] as PicturePreviewConfig[]),
					];
					this.pendingPreview = undefined;
					this.cdr.detectChanges();
				}
			}
		}
	}

	private setAsProfilePicture(config: PicturePreviewConfig): void {
		let aux = this.aux.find((a) => a.url === config.url);
		if (aux) {
			aux = { ...this.swapFiles(config) };
			if (!aux) return;
			aux.role = 'aux';
			this.aux = [
				...this.aux.reduce((acc, a) => {
					if (a.url === config.url && aux) acc.push(aux);
					else acc.push(a);
					return acc;
				}, [] as PicturePreviewConfig[]),
			];
			this.cdr.detectChanges();
		}
	}

	private setAsProfilePictureAPI(config: PicturePreviewConfig): void {
		this.userService
			.updateDefaultPicture(String(config.id))
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (response) => {
					if (response instanceof HttpResponse) {
						this.setAsProfilePicture(config);
						this.alert('success', 'File defined as profile picture');
					}
				},
				error: (error) => {
					this.alert('error', error.error.message);
				},
			});
	}

	private removeFile(config: PicturePreviewConfig): void {
		if (this.totalPlaceholders < 4) {
			if (config.role === 'main') {
				this.main = { role: 'main', url: '', id: 0, name: 'placeholder' };

				// TODO event que qq chose a ete sup -> recheck du profile
			} else if (config.role === 'aux') {
				this.aux = this.aux.filter((a) => a.url !== config.url && a.id !== config.id);
			}
			this.cdr.detectChanges();
		} else {
			this.alert('error', 'You need at least one picture');
		}
	}

	private removeFileFromAPI(config: PicturePreviewConfig): void {
		if (this.totalPlaceholders < 4) {
			this.fileService
				.deleteFileId(String(config.id))
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: () => {
						this.removeFile(config);
						this.alert('success', `File deleted`);
					},
					error: (error) => {
						this.alert('error', error.error.message);
					},
				});
		} else {
			this.alert('error', 'You need at least one picture');
		}
	}

	private addFile(file: File): void {
		this.fileService
			.addFileToProfile(this.getFormData(file))
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (response) => {
					if (response instanceof HttpResponse) {
						const { body } = response as { body: { url: string; id: number; name: string } };
						const config: PicturePreviewConfig = {
							url: body.url,
							id: body.id,
							name: body.name,
							role: 'aux',
						};
						this.saveUpload(config);
						this.alert('success', `File added`);
					}
				},
				error: (error) => {
					this.alert('error', error.error.message);
				},
			});
	}
}

import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	EventEmitter,
	HostListener,
	inject,
	Output,
} from '@angular/core';
import {
	AlertService,
	ClickStopPropagationDirective,
	FacebookService,
	FileReaderService,
	OauthService,
} from '@app/shared';
import {
	FacebookOauthFacade,
	FacebookPictureResponseDTO,
	FilePreview,
	isFacebookMe,
	WindowSettings,
} from '@app/models';
import { WindowComponent } from '@app/components';
import { forkJoin } from 'rxjs';
import { LoaderComponent } from '@app/components/loader/loader.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-upload-pictures',
	standalone: true,
	imports: [CommonModule, ClickStopPropagationDirective, WindowComponent, LoaderComponent],
	templateUrl: './upload-pictures.component.html',
	styleUrl: './upload-pictures.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadPicturesComponent extends FacebookOauthFacade {
	@Output() public askCloseModal: EventEmitter<string> = new EventEmitter<string>();
	@Output() public selectedPreviews: EventEmitter<{ preview: FilePreview; file: File }[]> = new EventEmitter<
		{
			preview: FilePreview;
			file: File;
		}[]
	>();
	protected previews: {
		preview: FilePreview;
		file: File;
		clicked: boolean;
	}[] = [];
	protected fbImport: boolean = false;
	protected fbChoiceIdx: number = -1;
	protected loadingBtnFacebook = false;
	private _destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private fileReader: FileReaderService,
		private cdr: ChangeDetectorRef,
		facebookService: FacebookService,
		alertService: AlertService,
		oauthService: OauthService,
	) {
		super(facebookService, alertService, oauthService);
	}

	protected onChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			this.fileReader
				.getFilePreview(file)
				.pipe(takeUntilDestroyed(this._destroyRef))
				.subscribe((preview) => {
					this.previews = [{ file, preview, clicked: true }];

					this.cdr.detectChanges();
				});
		}
	}

	protected onConfirmChoice(): void {
		if (this.previews.length > 0 && this.previews.some((preview) => preview.clicked)) {
			this.selectedPreviews.emit(this.previews.filter((preview) => preview.clicked));
		}
		this.onCloseModal();
	}

	protected onCloseModal(): void {
		this.fbImport = false;
		this.askCloseModal.emit('close');
	}

	protected onImportFromFacebook(): void {
		this.fbImport = false;
		this.loadingBtnFacebook = true;
		this.cdr.detectChanges();
		// charger les images, si utilisateur non connecté lui soumettre oauth
		this.getPicture()
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe({
				next: (picture) => {
					if (!picture) {
						this.connect = false;
						this.fbImport = false;
					}
					this.importFbPictures(picture);
				},
				complete: () => {
					this.loadingBtnFacebook = false;
				},
			});
	}

	private addPreviewFb(picture: FacebookPictureResponseDTO): void {
		if (Array.isArray(picture) && picture.length > 0 && picture[0] instanceof File) {
			const files$ = forkJoin(picture.map((file) => this.fileReader.getFilePreview(file)));
			files$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((previews) => {
				this.previews = picture.map((file, i) => ({ file, preview: previews[i], clicked: false }));
				this.cdr.detectChanges();
			});
		}
		this.fbImport = true;
	}

	private importFbPictures(payload: FacebookPictureResponseDTO | WindowSettings | null | File[] | unknown): void {
		if (
			typeof payload === 'object' &&
			payload !== null &&
			'name' in payload &&
			'url' in payload &&
			'options' in payload
		) {
			this.connect = true;
			this.fbImport = false;
		} else {
			this.addPreviewFb(payload as FacebookPictureResponseDTO);
		}
		this.cdr.detectChanges();
	}

	protected onNextFacebook(): void {
		this.loadingBtnFacebook = true;
		this.nextPicture()
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe({
				next: this.importFbPictures.bind(this),
				complete: () => {
					this.loadingBtnFacebook = false;
				},
			});
	}

	protected onPrevFacebook(): void {
		this.loadingBtnFacebook = true;
		this.previousPicture()
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe({
				next: this.importFbPictures.bind(this),
				complete: () => {
					this.loadingBtnFacebook = false;
				},
			});
	}

	protected onFacebookChoice(preview: { preview: FilePreview; file: File; clicked: boolean }, idx: number): void {
		this.previews.forEach((preview) => (preview.clicked = false));
		if (this.fbChoiceIdx === idx) {
			preview.clicked = false;
			this.fbChoiceIdx = -1;
			this.fbImport = true;
		} else {
			preview.clicked = true;
			this.fbChoiceIdx = idx;
			this.fbImport = false;
		}
		this.cdr.detectChanges();
	}

	@HostListener('window:storage', ['$event'])
	protected onStorageUpdate(event: StorageEvent): void {
		if (event.key === 'oauth') {
			if (event.newValue) {
				const datas = JSON.parse(event.newValue);
				if ('error' in datas) {
					this.alert('error', datas.error);
					window.localStorage.removeItem('oauth');
				} else if (isFacebookMe(datas) && this.oauthType === 'facebook') {
					const oauth = {
						type: this.oauthType,
						next: (): void => {
							this.connect = false;
							this.fbImport = true;
							this.onImportFromFacebook();
							this.cdr.detectChanges();
						},
						providerDatas: datas,
					};
					this.linkAccount(oauth);
				}
			}
		}
	}
}

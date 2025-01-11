import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	Renderer2,
	ViewChild,
} from '@angular/core';
import { FavoriteComponent } from '@app/components/icons/favorite/favorite.component';
import { FullscreenComponent } from '@app/components/icons/fullscreen/fullscreen.component';
import { PlayPauseComponent } from '@app/components/icons/play-pause/play-pause.component';
import { SaveComponent } from '@app/components/icons/save/save.component';
import { SettingsComponent } from '@app/components/icons/settings/settings.component';
import { SoundComponent } from '@app/components/icons/sound/sound.component';

@Component({
	selector: 'app-video',
	standalone: true,
	imports: [
		FavoriteComponent,
		FullscreenComponent,
		SettingsComponent,
		PlayPauseComponent,
		SaveComponent,
		SoundComponent,
	],
	templateUrl: './video.component.html',
	styleUrl: './video.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoComponent implements AfterViewInit {
	@Input({ required: true }) public src!: string;

	protected isPaused: boolean = true;
	protected progressVideo: number = 0;
	protected settingOpen: boolean = false;
	protected muted: boolean = false;
	protected soundValue: number = 1;
	@ViewChild('video') private video!: ElementRef;
	@ViewChild('sound') private sound!: ElementRef;

	public constructor(
		private changeDetector: ChangeDetectorRef,
		private renderer: Renderer2,
	) {}

	public ngAfterViewInit(): void {
		this.video.nativeElement.src = this.src;
		this.video.nativeElement.addEventListener('timeupdate', () => {
			this.progressVideo = (this.video.nativeElement.currentTime / this.video.nativeElement.duration) * 100;
			this.changeDetector.detectChanges();
		});
	}

	public onChangeSound(): void {
		if (!this.muted) {
			this.video.nativeElement.volume = this.sound.nativeElement.value;
			this.soundValue = this.sound.nativeElement.value;
		}
	}

	public onMuted(): void {
		if (this.video.nativeElement.muted == false) {
			this.video.nativeElement.muted = true;
		} else {
			this.video.nativeElement.muted = false;
		}
		this.muted = this.video.nativeElement.muted;
		this.onChangeSound();
	}

	public onPlay(): void {
		if (this.video.nativeElement.paused) {
			this.video.nativeElement.play();
			this.isPaused = false;
		} else {
			this.video.nativeElement.pause();
			this.isPaused = true;
		}
	}

	public onFullSize(): void {
		this.video.nativeElement.requestFullscreen();
	}

	public onOpenSettings(): void {
		this.settingOpen = !this.settingOpen;
		if (this.settingOpen) {
			const interval = setInterval(() => {
				if (this.sound) {
					this.configSound();
					clearInterval(interval);
				}
			}, 100);
		}
	}

	public configSound(): void {
		this.sound.nativeElement.value = this.video.nativeElement.sound;
		this.soundValue = this.sound.nativeElement.value;
	}

	public onDownloads(): void {
		const a = this.renderer.createElement('a');
		a.href = this.src;
		a.click();
	}
}

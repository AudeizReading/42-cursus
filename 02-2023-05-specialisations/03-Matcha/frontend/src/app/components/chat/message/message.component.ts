import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CrossComponent } from '@app/components/icons/cross/cross.component';
import { AudioComponent } from '@app/components/player/audio/audio.component';
import { VideoComponent } from '@app/components/player/video/video.component';
import { ChatConversationAPIResponseDTO } from '@app/models';

@Component({
	selector: 'app-message',
	standalone: true,
	imports: [AudioComponent, CrossComponent, VideoComponent],
	templateUrl: './message.component.html',
	styleUrl: './message.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
	@Input() public message!: ChatConversationAPIResponseDTO;
	@Input() public isMe!: boolean;

	public pictureIsOpen: boolean = false;

	public constructor(private sanitizer: DomSanitizer) {}

	public isUrlMessage(): boolean {
		if (!this.message.message) return false;
		const parts = this.partMessage();
		for (let i = 0; i < parts.length; i++) {
			if (parts[i].value instanceof URL) {
				return true;
			}
		}
		return false;
	}

	public partMessage(): { type: string; value: string | URL }[] {
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		const parts = this.message.message.split(urlRegex);
		return parts.map((part) => {
			if (urlRegex.test(part)) {
				const url = new URL(part);
				if (url.origin == 'https://www.youtube.com') {
					return { value: url, type: 'YOUTUBE' };
				} else if (url.origin == 'https://www.dailymotion.com') {
					return { value: url, type: 'DAILYMOTION' };
				} else if (url.origin == 'https://vimeo.com') {
					return { value: url, type: 'VIMEO' };
				}
				return { value: url, type: 'URL' };
			} else {
				return { value: String(part), type: 'message' };
			}
		});
	}

	public getYoutubeURL(value: unknown): SafeUrl | undefined {
		const v = (value as URL).search.split('?v=')[1];
		if (v == undefined) return undefined;
		const url = 'https://www.youtube.com/embed/' + (value as URL).search.split('?v=')[1];
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	public getDailymotion(value: unknown): SafeUrl | undefined {
		const s = (value as URL).pathname.split('/').filter((v) => v != '');
		if (s.length == 2 && s[0] == 'video') {
			const url = `https://geo.dailymotion.com/player.html?video=${s[1]}`;
			return this.sanitizer.bypassSecurityTrustResourceUrl(url);
		}
		return undefined;
	}

	public getVimeo(value: unknown): SafeUrl | undefined {
		const s = (value as URL).pathname.split('/').filter((v) => v != '');
		if (s.length == 1 && !Number.isNaN(Number.parseInt(s[0]))) {
			const url = `https://player.vimeo.com/video/${s[0]}?autoplay=0`;
			return this.sanitizer.bypassSecurityTrustResourceUrl(url);
		}
		return undefined;
	}

	public openPicture(): void {
		this.pictureIsOpen = true;
	}

	public closePicture(): void {
		this.pictureIsOpen = false;
	}
}

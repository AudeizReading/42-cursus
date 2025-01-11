import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { environment } from '@env/environment';
import { NgxAudioWaveModule } from 'ngx-audio-wave';

@Component({
	selector: 'app-audio',
	standalone: true,
	imports: [NgxAudioWaveModule],
	templateUrl: './audio.component.html',
	styleUrls: ['./audio.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioComponent {
	@Input({ required: true }) public src!: string;

	public get getSrc(): string {
		return `${environment.frontendUrl}${this.src}`;
	}
}

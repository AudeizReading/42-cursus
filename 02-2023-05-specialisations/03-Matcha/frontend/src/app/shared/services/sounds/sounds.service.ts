import { Injectable } from '@angular/core';

enum SoundFileEnum {
	ALERT = '/assets/sounds/m4a_Alert_3rdParty_Haptic.m4a',
	CALL_LEAVE = '/assets/sounds/m4a_MultiwayLeave.m4a',
	RECEIVED_MESSAGE = '/assets/sounds/m4a_ReceivedMessage.m4a',
	SENT_MESSAGE = '/assets/sounds/m4a_SentMessage.m4a',
	BEGIN_RECORD = '/assets/sounds/m4a_begin_record.m4a',
	END_RECORD = '/assets/sounds/m4a_end_record.m4a',
	JBL_BEGIN = '/assets/sounds/m4a_jbl_begin.m4a',
	JBL_CONFIRM = '/assets/sounds/m4a_jbl_confirm.m4a',
	PHOTO_SHUTTER = '/assets/sounds/m4a_photoShutter.m4a',
	VIDEO_CALL_END = '/assets/sounds/m4a_vc~ended.m4a',
	VIDEO_CALL_ACCEPTED = '/assets/sounds/m4a_vc~invitation-accepted.m4a',
	VIDEO_CALL_RINGING = '/assets/sounds/m4a_vc~ringing.m4a',
	VIDEO_CALL_RINGING_WATCH = '/assets/sounds/m4a_vc~ringing_watch.m4a',
}

abstract class SoundBase {
	protected playAndDelete(media: HTMLAudioElement | undefined): void {
		if (media === undefined) {
			throw new Error(`Using init() before this method`);
		}
		let mediaAudio: HTMLAudioElement | undefined = new Audio(media.src);
		mediaAudio.play().catch((error) => {
			console.error('Error while playing audio:', error);
		});
		const onDelete = (): void => {
			mediaAudio = undefined;
		};
		const onEnded = (): void => {
			mediaAudio?.removeEventListener('ended', onDelete);
		};
		mediaAudio.addEventListener('ended', onEnded);
	}
}

class Call extends SoundBase {
	private _callLeave = new Audio(SoundFileEnum.CALL_LEAVE);
	private _videoCallEnd = new Audio(SoundFileEnum.VIDEO_CALL_END);
	private _videoCallAccepted = new Audio(SoundFileEnum.VIDEO_CALL_ACCEPTED);
	private _videoCallRinging = new Audio(SoundFileEnum.VIDEO_CALL_RINGING);
	private _videoCallRingingWatch = new Audio(SoundFileEnum.VIDEO_CALL_RINGING_WATCH);

	public callLeave(): void {
		this.playAndDelete(this._callLeave);
	}

	public callEnd(): void {
		this.playAndDelete(this._videoCallEnd);
	}

	public callAccepted(): void {
		this.playAndDelete(this._videoCallAccepted);
	}

	public callRinging(): void {
		this.playAndDelete(this._videoCallRinging);
	}

	public callRingingWatch(): void {
		this.playAndDelete(this._videoCallRingingWatch);
	}
}

class Media extends SoundBase {
	private _beginRecord = new Audio(SoundFileEnum.BEGIN_RECORD);
	private _endRecord = new Audio(SoundFileEnum.END_RECORD);
	private _jblBegin = new Audio(SoundFileEnum.JBL_BEGIN);
	private _jblEnd = new Audio(SoundFileEnum.JBL_CONFIRM);
	private _photoShutter = new Audio(SoundFileEnum.PHOTO_SHUTTER);

	public beginRecord(): void {
		this.playAndDelete(this._beginRecord);
	}

	public endRecord(): void {
		this.playAndDelete(this._endRecord);
	}

	public dictaphoneBegin(): void {
		this.playAndDelete(this._jblBegin);
	}

	public dictaphoneEnd(): void {
		this.playAndDelete(this._jblEnd);
	}

	public takePicture(): void {
		this.playAndDelete(this._photoShutter);
	}
}

class Message extends SoundBase {
	private _receivedMessage = new Audio(SoundFileEnum.RECEIVED_MESSAGE);
	private _sentMessage = new Audio(SoundFileEnum.SENT_MESSAGE);

	public sentMessage(): void {
		this.playAndDelete(this._sentMessage);
	}

	public receiveMessage(): void {
		this.playAndDelete(this._receivedMessage);
	}
}

class Other extends SoundBase {
	private _alert = new Audio(SoundFileEnum.ALERT);

	public alert(): void {
		this.playAndDelete(this._alert);
	}
}

class JukeBox {
	protected call: Call | undefined;
	protected media: Media | undefined;
	protected message: Message | undefined;
	protected other: Other | undefined;

	private check<T>(event: T | undefined): T {
		if (event === undefined) {
			throw new Error(`Using init() before this method`);
		}
		return event;
	}

	public callSounds(): Call {
		return this.check(this.call);
	}

	public mediaSounds(): Media {
		return this.check(this.media);
	}

	public messageSounds(): Message {
		return this.check(this.message);
	}

	public otherSounds(): Other {
		return this.check(this.other);
	}
}

abstract class AInitialize {
	public abstract declareCall(): AInitialize;
	public abstract declareMedia(): AInitialize;
	public abstract declareMessage(): AInitialize;
	public abstract declareOther(): AInitialize;
}

class Initialize extends JukeBox implements AInitialize {
	public declareCall(): AInitialize {
		if (this.call == undefined) {
			this.call = new Call();
		}
		return this;
	}

	public declareMedia(): AInitialize {
		if (this.media == undefined) {
			this.media = new Media();
		}
		return this;
	}

	public declareMessage(): AInitialize {
		if (this.message == undefined) {
			this.message = new Message();
		}
		return this;
	}

	public declareOther(): AInitialize {
		if (this.other == undefined) {
			this.other = new Other();
		}
		return this;
	}
}

@Injectable({
	providedIn: 'root',
})
export class SoundsService {
	private initialize: Initialize | undefined;

	public init(): AInitialize {
		if (this.initialize == undefined) {
			this.initialize = new Initialize();
		}
		return this.initialize;
	}

	public play(): JukeBox {
		if (this.initialize === undefined) {
			throw new Error('Using init() before this method');
		}
		return this.initialize;
	}
}

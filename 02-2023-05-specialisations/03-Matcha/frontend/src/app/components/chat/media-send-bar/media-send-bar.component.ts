import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	Output,
	Renderer2,
	ViewChild,
} from '@angular/core';
import { AddComponent } from '@app/components/icons/add/add.component';
import { MicroComponent } from '@app/components/icons/micro/micro.component';
import { CrossComponent } from '@app/components/icons/cross/cross.component';
import { WebcamComponent } from '@app/components/icons/webcam/webcam.component';
import { CallType, ChatMediaAction, EventBodyDTO, FileDTO, LeafletCoordinatesDTO, Profile } from '@app/models';
import { AlertService, ClickStopPropagationDirective, EventService, SoundsService } from '@app/shared';
import { CallAudioComponent } from '@app/components/icons/call/call-audio/call-audio.component';
import { CallVideoComponent } from '@app/components/icons/call/call-video/call-video.component';
import { CreateComponent } from '@app/components/icons/event/create/create.component';
import { HttpResponse } from '@angular/common/http';
import { LoaderComponent } from '@app/components/loader/loader.component';
import { TrashComponent } from '@app/components/icons/trash/trash.component';
import { InputIconComponent } from '@app/components/input-icon/input-icon.component';
import { TextareaComponent, FakeLocationDialogComponent } from '@app/components';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-media-send-bar',
	standalone: true,
	imports: [
		AddComponent,
		CommonModule,
		ClickStopPropagationDirective,
		MicroComponent,
		CrossComponent,
		WebcamComponent,
		CallAudioComponent,
		CallVideoComponent,
		CreateComponent,
		FakeLocationDialogComponent,
		LoaderComponent,
		TrashComponent,
		InputIconComponent,
		TextareaComponent,
		ReactiveFormsModule,
	],
	templateUrl: './media-send-bar.component.html',
	styleUrl: './media-send-bar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaSendBarComponent {
	protected medias = [
		{ type: 'PICTURE', mime: 'image/*' },
		{ type: 'VIDEO', mime: 'video/*' },
		{ type: 'AUDIO', mime: 'audio/*' },
	];

	protected open: boolean = false;

	public recorder: MediaRecorder | null = null;
	private currentStream: MediaStream | null = null;
	private audioChunks: Blob[] = [];
	private videoChunks: Blob[] = [];
	protected cameraMode: string = 'picture';
	protected modalWebcam: boolean = false;
	protected modalEvent: boolean = false;

	protected formEvent: FormGroup | undefined = undefined;

	protected loadPicture: boolean = false;
	protected inputFile: FileDTO | undefined = undefined;
	protected location: { latitude: number; longitude: number } | undefined = undefined;
	protected loadSendEvent: boolean = false;

	@Output()
	public chatMediaAction: EventEmitter<ChatMediaAction> = new EventEmitter<ChatMediaAction>();
	@Output()
	public callEmit: EventEmitter<CallType> = new EventEmitter<CallType>();

	@Input()
	public user!: Profile;
	@Input()
	public correspondant!: Profile;

	@ViewChild('webcam') private webcam!: ElementRef;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private alertService: AlertService,
		private renderer: Renderer2,
		private readonly soundsService: SoundsService,
		private readonly eventService: EventService,
		private changeDetector: ChangeDetectorRef,
		private formBuilder: FormBuilder,
	) {
		this.soundsService.init().declareMedia();
	}

	public onAdd(event: Event): void {
		event.preventDefault();
		this.open = !this.open;
	}

	public onChange(event: Event, media: { mime: string; type: string }): void {
		const files = (event.target as HTMLInputElement).files;
		const file = files && files.length ? files[0] : null;
		if (!file) {
			this.alert('error', 'No media selected');
			return;
		}
		this.chatMediaAction.emit({ action: media.type, uploader: file });
		this.open = false;
	}

	private alert(type: 'error' | 'success', message: string): void {
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

	public onMicro(): void {
		this.stopStream();
		navigator.permissions.query({ name: 'microphone' as PermissionName }).then((v) => {
			switch (v.state) {
				case 'prompt':
					navigator.mediaDevices
						.getUserMedia({ audio: true })
						.then((v) => {
							this.useMicrophone(v);
						})
						.catch(() => {
							this.alert('error', 'Please enabled Microphone on navigator');
						});
					break;
				case 'granted':
					navigator.mediaDevices.getUserMedia({ audio: true }).then((v) => {
						this.useMicrophone(v);
					});
					break;
				case 'denied':
					this.alert('error', 'Please enabled Microphone on navigator');
			}
		});
	}

	private useMicrophone(stream: MediaStream): void {
		this.soundsService.play().mediaSounds().dictaphoneBegin();
		this.recorder = new MediaRecorder(stream);
		this.currentStream = stream;

		this.recorder.ondataavailable = (event): void => {
			if (event.data.size > 0) {
				this.audioChunks.push(event.data);
			}
		};

		this.recorder.onstop = (): void => {
			this.soundsService.play().mediaSounds().dictaphoneEnd();
			this.stopStream();
			const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
			this.audioChunks = [];
			const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
			this.chatMediaAction.emit({ action: 'AUDIO', uploader: audioFile });
		};

		this.recorder.start();
	}

	private stopStream(): void {
		if (this.currentStream) {
			this.currentStream.getTracks().forEach((track) => track.stop());
			this.currentStream = null;
		}
	}

	public onStopMicro(): void {
		if (this.recorder) {
			this.recorder.stop();
			this.open = false;
		}
	}

	public onWebcam(): void {
		this.stopStream();
		this.modalWebcam = !this.modalWebcam;
		this.open = false;
		this.requestMediaWebcam();
	}

	public requestMediaWebcam(): void {
		switch (this.cameraMode) {
			case 'picture':
				this.requestPicture();
				break;
			case 'video':
				this.requestVideo();
				break;
		}
	}

	public onChangeModeWebcam(mode: string): void {
		this.cameraMode = mode;
		this.stopStream();
		this.requestMediaWebcam();
	}

	public closeModalWebcam(): void {
		this.modalWebcam = false;
		this.stopStream();
	}

	private requestPicture(): void {
		navigator.permissions.query({ name: 'camera' as PermissionName }).then((v) => {
			switch (v.state) {
				case 'prompt':
					navigator.mediaDevices
						.getUserMedia({ video: true })
						.then((v) => {
							this.useWebcam(v);
						})
						.catch(() => {
							this.alert('error', 'Please enabled Webcam on navigator');
						});
					break;
				case 'granted':
					navigator.mediaDevices.getUserMedia({ video: true }).then((v) => {
						this.useWebcam(v);
					});
					break;
				case 'denied':
					this.alert('error', 'Please enabled Webcam on navigator');
			}
		});
	}

	private requestVideo(): void {
		const requestRightMicrophone = (): void => {
			navigator.permissions.query({ name: 'microphone' as PermissionName }).then((v) => {
				switch (v.state) {
					case 'prompt':
						navigator.mediaDevices
							.getUserMedia({ audio: true, video: true })
							.then((v) => {
								this.useWebcam(v);
							})
							.catch(() => {
								this.alert('error', 'Please enabled Microphone on navigator');
							});
						break;
					case 'granted':
						navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((v) => {
							this.useWebcam(v);
						});
						break;
					case 'denied':
						this.alert('error', 'Please enabled Microphone on navigator');
				}
			});
		};
		navigator.permissions.query({ name: 'camera' as PermissionName }).then((v) => {
			switch (v.state) {
				case 'prompt':
					requestRightMicrophone();
					break;
				case 'granted':
					requestRightMicrophone();
					break;
				case 'denied':
					this.alert('error', 'Please enabled Webcam and Microphone on navigator');
			}
		});
	}

	private useWebcam(stream: MediaStream): void {
		this.recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
		this.currentStream = stream;
		this.webcam.nativeElement.srcObject = stream;
		this.webcam.nativeElement.muted = true;
	}

	public onTake(): void {
		switch (this.cameraMode) {
			case 'picture':
				this.takePicture();
				break;
			case 'video':
				this.takeVideo();
				break;
		}
	}

	private takePicture(): void {
		const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
		canvas.width = this.webcam.nativeElement.videoWidth;
		canvas.height = this.webcam.nativeElement.videoHeight;
		const context = canvas.getContext('2d');
		if (context) {
			context.drawImage(this.webcam.nativeElement, 0, 0, canvas.width, canvas.height);
			canvas.toBlob((blob) => {
				if (blob) {
					this.soundsService.play().mediaSounds().takePicture();
					this.stopStream();
					const imageFile = new File([blob], 'picture.png', { type: 'image/png' });
					this.chatMediaAction.emit({ action: 'PICTURE', uploader: imageFile });
				}
			}, 'image/png');
		}
	}

	private takeVideo(): void {
		if (this.recorder) {
			switch (this.recorder.state) {
				case 'inactive':
					this.soundsService.play().mediaSounds().beginRecord();
					this.recorder.ondataavailable = (event): void => {
						if (event.data.size > 0) {
							this.videoChunks.push(event.data);
						}
					};
					this.recorder.onstop = (): void => {
						this.soundsService.play().mediaSounds().endRecord();
						this.stopStream();
						const videoBlob = new Blob(this.videoChunks, { type: 'video/webm' });
						this.videoChunks = [];
						const videoFile = new File([videoBlob], 'recording.webm', { type: 'video/webm' });
						this.chatMediaAction.emit({ action: 'VIDEO', uploader: videoFile });
					};
					this.recorder.start();
					break;
				case 'recording':
					this.onStopMicro();
					break;
			}
		}
	}

	public emitCall(event: CallType): void {
		this.callEmit.emit(event);
		this.open = false;
	}

	public closeModalEvent(): void {
		this.modalEvent = false;
	}

	public newEvent(): void {
		this.loadPicture = false;
		this.inputFile = undefined;
		this.location = undefined;
		this.loadSendEvent = false;
		this.loadSendEvent = false;
		this.formEvent = this.formBuilder.group({
			datetime: new FormControl(''),
			title: new FormControl(''),
			description: new FormControl(''),
		}) satisfies FormGroup;
		this.modalEvent = true;
		this.open = false;
	}

	public onClosedModalMap(event: LeafletCoordinatesDTO): void {
		const { latitude, longitude } = event;
		this.location = {
			latitude,
			longitude,
		};
	}

	protected get getDescriptionFormControl(): FormControl {
		return this.formEvent!.get('description') as FormControl;
	}

	public onChangePicture(event: Event): void {
		const input = event.srcElement as HTMLInputElement;
		const files = input.files;
		if (files?.length == 1) {
			this.loadPicture = true;
			this.eventService
				.postEventFile(files[0])
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (event: HttpResponse<FileDTO>) => {
						if (event.body) {
							this.inputFile = event.body;
							this.loadPicture = false;
							this.changeDetector.detectChanges();
						}
					},
					error: () => {
						this.loadPicture = false;
						this.changeDetector.detectChanges();
					},
				});
		}
	}

	public onRemovePicture(): void {
		this.inputFile = undefined;
	}

	public onRemoveLocation(): void {
		this.location = undefined;
	}

	public onSubmitCreateEvent(): void {
		const title = this.formEvent!.get('title')?.value;
		const date = this.formEvent!.get('datetime')?.value;
		const description = this.formEvent!.get('description')?.value;
		if (
			title == undefined ||
			date == undefined ||
			description == undefined ||
			title?.length < 3 ||
			description?.length < 3 ||
			date?.length <= 3
		) {
			this.alert('error', 'Value not complette (required minimal: title, date and description)');
			return;
		}
		let event: EventBodyDTO = {
			name: title,
			datetime: date,
			description,
			matchId: this.correspondant.id!,
		};
		if (this.inputFile && this.inputFile.id) {
			event = { ...event, fileId: this.inputFile.id };
		}
		if (this.location) {
			event = { ...event, location: this.location };
		}
		this.loadSendEvent = true;
		this.eventService
			.postEvent(event)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload) => {
					if (payload instanceof HttpResponse) {
						this.modalEvent = false;
						this.loadSendEvent = false;
						this.alert('success', 'Your event is created');
						this.changeDetector.markForCheck();
					}
				},
				error: () => {
					this.alert('error', 'Your event is not created');
					this.loadSendEvent = false;
					this.changeDetector.markForCheck();
				},
			});
	}

	public get getLocationInit(): LeafletCoordinatesDTO {
		return {
			type: 'FAKE',
			zoom: 15,
			latitude: this.user.location!.latitude,
			longitude: this.user.location!.longitude,
		};
	}
}

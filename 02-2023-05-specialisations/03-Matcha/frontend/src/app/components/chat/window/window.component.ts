import {
	AfterViewInit,
	ApplicationRef,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ComponentFactoryResolver,
	DestroyRef,
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { CdkPortal, DomPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { AlertService, ChatService, SoundsService } from '@app/shared';
import { CallRefuseComponent } from '@app/components/icons/call/call-refuse/call-refuse.component';
import { Peer } from 'peerjs';
import { CallAcceptComponent } from '@app/components/icons/call/call-accept/call-accept.component';
import { AcceptCallDTO, AlertFacade } from '@app/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type ModeType =
	| 'RECEIPE_AUDIO'
	| 'SEND_AUDIO'
	| 'RECEIPE_VIDEO'
	| 'SEND_VIDEO'
	| 'VIDEO'
	| 'AUDIO'
	| 'END'
	| 'NOT_AVAILABLE';

@Component({
	selector: 'app-window',
	standalone: true,
	imports: [PortalModule, CallRefuseComponent, CallAcceptComponent],
	templateUrl: './window.component.html',
	styleUrl: './window.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WindowComponent extends AlertFacade implements OnInit, OnDestroy, AfterViewInit, OnChanges {
	@ViewChild(CdkPortal)
	private portal: CdkPortal | undefined;
	@ViewChild('myWebcam')
	private myWebcam: ElementRef | undefined;
	@ViewChild('callWebcam')
	private otherWebcam: ElementRef | undefined;
	@ViewChild('callAudio')
	private otherAudio: ElementRef | undefined;
	@ViewChild('audioSpecteCanvas')
	private audioSpecteCanvas: ElementRef | undefined;
	@ViewChild('inputId')
	private inputId: ElementRef | undefined;

	@Output()
	public closeEvent: EventEmitter<void> = new EventEmitter();

	private externalWindow: Window | null = null;
	private host: DomPortalOutlet | null = null;
	private width: number;
	private height: number;
	@Input({ required: true })
	public mode!: ModeType;
	@Input({ required: true })
	public username!: string;
	@Input({ required: true })
	public userPictureUrl!: string;
	@Input({ required: true })
	public userId!: number;
	private currentStream: MediaStream | null = null;
	private closeCheckInterval: NodeJS.Timeout | undefined;
	private intervalSounds: NodeJS.Timeout[] = [];
	public otherPeerId: string = '';

	protected peer = new Peer();
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private applicationRef: ApplicationRef,
		private injector: Injector,
		private cdr: ChangeDetectorRef,
		private soundsService: SoundsService,
		private chatService: ChatService,
		alertService: AlertService,
	) {
		super(alertService);
		this.width = 0;
		this.height = 0;
		this.soundsService.init().declareCall();
	}

	public async ngOnInit(): Promise<void> {
		this.externalWindow = window.open('', '', `width=${this.width},height=${this.height}`);

		if (this.externalWindow) {
			this.copyStyles(document, this.externalWindow.document);
			this.externalWindow.addEventListener('resize', () => {
				this.onResize();
			});
			this.closeCheckInterval = setInterval(() => {
				if (this.externalWindow?.closed) {
					this.closeEvent.emit();
					this.onClose();
				}
			}, 500);
			await this.changeMode(this.mode);
			this.setInCenter();
		}
		if (this.mode == 'SEND_AUDIO' || this.mode === 'SEND_VIDEO') {
			this.chatService.sendCall(this.mode == 'SEND_AUDIO' ? 'AUDIO' : 'VIDEO', this.userId, this.peer.id);
		}
		this.chatService.acceptCallState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: (event: AcceptCallDTO) => {
				this.otherPeerId = event.rtcId;
				if (this.mode === 'SEND_AUDIO' || this.mode === 'SEND_VIDEO') {
					this.changeMode(this.mode == 'SEND_AUDIO' ? 'AUDIO' : 'VIDEO');
				}
				this.setOtherPeerId();
			},
		});
		this.chatService.unreacheableCallState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
			next: () => {
				this.changeMode('NOT_AVAILABLE');
			},
		});
	}

	public ngAfterViewInit(): void {
		if (this.externalWindow && this.portal) {
			this.host = new DomPortalOutlet(
				this.externalWindow.document.body as Element,
				this.componentFactoryResolver,
				this.applicationRef,
				this.injector,
			);
			this.host.attach(this.portal);
		}
	}

	public ngOnDestroy(): void {
		this.externalWindow?.close();
		this.host?.detach();
		if (this.closeCheckInterval) {
			clearInterval(this.closeCheckInterval);
		}
	}

	public ngOnChanges(): void {
		this.changeMode(this.mode);
	}

	private copyStyles(sourceDoc: Document, targetDoc: Document): void {
		Array.from(sourceDoc.styleSheets).forEach((styleSheet: CSSStyleSheet) => {
			try {
				const cssRules: CSSRuleList | undefined = styleSheet.cssRules;
				if (cssRules) {
					const newStyleEl = targetDoc.createElement('style');
					Array.from(cssRules).forEach((cssRule: CSSRule) => {
						newStyleEl.appendChild(targetDoc.createTextNode(cssRule.cssText));
					});
					targetDoc.head.appendChild(newStyleEl);
				}
			} catch (e) {
				if (styleSheet.href) {
					const newLinkEl = targetDoc.createElement('link');
					newLinkEl.rel = 'stylesheet';
					newLinkEl.href = styleSheet.href;
					targetDoc.head.appendChild(newLinkEl);
				} else {
					this.alert('error', 'Unable to copy stylesheet');
				}
			}
		});
	}

	private setOtherPeerId(): void {
		const interval = setInterval(() => {
			if (this.otherWebcam?.nativeElement !== undefined || this.otherAudio?.nativeElement !== undefined) {
				clearInterval(interval);
				const onStream = (remoteStream: MediaStream): void => {
					switch (this.mode) {
						case 'VIDEO':
							(this.otherWebcam?.nativeElement as HTMLVideoElement).srcObject = remoteStream;
							break;
						case 'AUDIO': {
							(this.otherAudio?.nativeElement as HTMLAudioElement).srcObject = remoteStream;
							const audioElement = this.otherAudio?.nativeElement as HTMLAudioElement;
							audioElement
								.play()
								.then(() => {
									this.setupAudioContext(remoteStream);
									this.drawSpecte();
								})
								.catch((error) => {
									this.alert('error', 'Error while reading audio:', error);
								});
							break;
						}
					}
				};
				const call = this.peer.call(this.otherPeerId, this.currentStream as MediaStream);
				call.on('stream', onStream);
				this.peer.on('call', (call) => {
					call.answer(this.currentStream as MediaStream);
					call.on('stream', onStream);
				});
			}
		}, 100);
	}

	private audioCtx!: AudioContext;
	private analyser!: AnalyserNode;
	private source!: MediaStreamAudioSourceNode;
	private isDrawing = false;

	private setupAudioContext(stream: MediaStream): void {
		if (!this.externalWindow) {
			this.alert('error', 'Window not available');
			return;
		}
		this.audioCtx = new AudioContext();
		this.analyser = this.audioCtx.createAnalyser();
		this.source = this.audioCtx.createMediaStreamSource(stream);
		this.source.connect(this.analyser);
		this.analyser.connect(this.audioCtx.destination);
		this.analyser.fftSize = 2048;
	}

	private drawSpecte(): void {
		const canvas = this.audioSpecteCanvas?.nativeElement as HTMLCanvasElement;
		const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
		if (!ctx) {
			this.alert('error', 'Canvas context not available');
			return;
		}

		if (this.audioCtx.state === 'suspended') {
			this.audioCtx.resume().then(() => {
				this.isDrawing = true;
				this.startDrawing(ctx, canvas);
			});
		} else {
			this.isDrawing = true;
			this.startDrawing(ctx, canvas);
		}
	}

	private startDrawing(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
		canvas.width = this.externalWindow!.window.innerWidth;
		canvas.height = this.externalWindow!.window.innerHeight;

		const draw = (): void => {
			if (!this.isDrawing) return;
			requestAnimationFrame(draw);

			const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
			this.analyser.getByteTimeDomainData(dataArray);

			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
			gradient.addColorStop(0, 'rgba(255, 20, 147, 0.8)');
			gradient.addColorStop(1, 'rgba(255, 20, 147, 0.1)');

			const baseRadius = Math.min(canvas.width, canvas.height) / 3;
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;
			const numBars = dataArray.length;

			const angleStep = (Math.PI * 2) / numBars;
			const maxBarLength = baseRadius / 2;

			for (let i = 0; i < numBars; i++) {
				const value = dataArray[i] / 255.0;
				const barLength = value * maxBarLength;
				const angle = i * angleStep;

				const xStart = centerX + Math.cos(angle) * baseRadius;
				const yStart = centerY + Math.sin(angle) * baseRadius;
				const xEnd = centerX + Math.cos(angle) * (baseRadius + barLength);
				const yEnd = centerY + Math.sin(angle) * (baseRadius + barLength);

				ctx.beginPath();
				ctx.moveTo(xStart, yStart);
				ctx.lineTo(xEnd, yEnd);
				ctx.lineWidth = 2;
				ctx.strokeStyle = gradient;
				ctx.stroke();
			}
		};

		draw();
	}

	private setInCenter(): void {
		const left = window.screen.width / 2 - this.width / 2;
		const top = window.screen.height / 2 - this.height / 2;
		if (this.externalWindow) {
			this.externalWindow.moveTo(left, top);
		}
	}

	protected async changeMode(mode: ModeType): Promise<void> {
		if (this.mode != mode) {
			this.stopStream();
		}
		if (mode != 'AUDIO') {
			this.isDrawing = false;
		}
		switch (mode) {
			case 'AUDIO':
				if (this.mode === 'RECEIPE_AUDIO') this.chatService.acceptCall(this.peer.id);
				this.cleanTone();
				this.titleWindow(`Audio call with ${this.username}`);
				this.resizeWindow(350, 400);
				await this.request({ audio: true });
				this.soundsService.play().callSounds().callAccepted();
				break;
			case 'VIDEO':
				if (this.mode === 'RECEIPE_VIDEO') this.chatService.acceptCall(this.peer.id);
				this.cleanTone();
				this.titleWindow(`Video call with ${this.username}`);
				this.resizeWindow(300, 500);
				await this.request({ video: true, audio: true });
				this.soundsService.play().callSounds().callAccepted();
				break;
			case 'END':
				this.chatService.endCall();
				this.cleanTone();
				this.titleWindow(`End call with ${this.username}`);
				this.resizeWindow(300, 450);
				this.soundsService.play().callSounds().callEnd();
				break;
			case 'NOT_AVAILABLE':
				this.cleanTone();
				this.titleWindow(`${this.username} is not available`);
				this.resizeWindow(300, 450);
				this.soundsService.play().callSounds().callLeave();
				break;
			case 'RECEIPE_AUDIO': {
				this.titleWindow(`${this.username} call you in audio`);
				this.resizeWindow(300, 300);
				await this.request({ audio: true });
				this.soundsService.play().callSounds().callRingingWatch();
				const intervaReceiveAudio = setInterval(() => {
					if (this.mode !== 'RECEIPE_AUDIO') {
						clearInterval(intervaReceiveAudio);
					} else {
						this.soundsService.play().callSounds().callRingingWatch();
					}
				}, 2000);
				this.intervalSounds.push(intervaReceiveAudio);
				break;
			}
			case 'RECEIPE_VIDEO': {
				this.titleWindow(`${this.username} call you in video`);
				this.resizeWindow(300, 300);
				await this.request({ video: true, audio: true });
				this.soundsService.play().callSounds().callRingingWatch();
				const intervaReceiveVideo = setInterval(() => {
					if (this.mode !== 'RECEIPE_VIDEO') {
						clearInterval(intervaReceiveVideo);
					} else {
						this.soundsService.play().callSounds().callRingingWatch();
					}
				}, 2000);
				this.intervalSounds.push(intervaReceiveVideo);
				break;
			}
			case 'SEND_AUDIO': {
				this.titleWindow(`Emit audio call with ${this.username}`);
				this.resizeWindow(300, 300);
				await this.request({ audio: true });
				this.soundsService.play().callSounds().callRinging();
				const intervalSendAudio = setInterval(() => {
					if (this.mode !== 'SEND_AUDIO') {
						clearInterval(intervalSendAudio);
					} else {
						this.soundsService.play().callSounds().callRinging();
					}
				}, 2000);
				this.intervalSounds.push(intervalSendAudio);
				break;
			}
			case 'SEND_VIDEO': {
				this.titleWindow(`Emit video call with ${this.username}`);
				this.resizeWindow(300, 500);
				await this.request({ video: true, audio: true });
				this.soundsService.play().callSounds().callRinging();
				const intervalSendVideo = setInterval(() => {
					if (this.mode !== 'SEND_VIDEO') {
						clearInterval(intervalSendVideo);
					} else {
						this.soundsService.play().callSounds().callRinging();
					}
				}, 2000);
				this.intervalSounds.push(intervalSendVideo);
				break;
			}
		}
		this.mode = mode;
		this.cdr.detectChanges();
	}

	private async request(constraints?: MediaStreamConstraints): Promise<void> {
		if (this.externalWindow) {
			return await this.externalWindow?.navigator.mediaDevices
				.getUserMedia(constraints)
				.then((v) => {
					this.currentStream = v;
					if (this.mode === 'RECEIPE_VIDEO' || this.mode === 'SEND_VIDEO' || this.mode === 'VIDEO') {
						const interval = setInterval(() => {
							if (this.mode !== 'RECEIPE_VIDEO' && this.mode !== 'SEND_VIDEO' && this.mode !== 'VIDEO') {
								clearInterval(interval);
							}
							if (this.myWebcam?.nativeElement) {
								clearInterval(interval);
								(this.myWebcam.nativeElement as HTMLVideoElement).srcObject = this.currentStream;
								(this.myWebcam.nativeElement as HTMLVideoElement).muted = true;
							}
						}, 100);
					}
				})
				.catch(() => {
					this.onClose();
				});
		}
	}

	private stopStream(): void {
		if (this.currentStream) {
			this.currentStream.getTracks().forEach((track) => track.stop());
			this.currentStream = null;
		}
	}

	private onResize(): void {
		this.resizeWindow(this.width, this.height);
	}

	private cleanTone(): void {
		this.intervalSounds.forEach((interval) => {
			clearInterval(interval);
		});
	}

	private onClose(): void {
		this.chatService.endCall();
		this.cleanTone();
		this.stopStream();
		this.isDrawing = false;
		if (this.closeCheckInterval) {
			clearInterval(this.closeCheckInterval);
		}
	}

	private titleWindow(title: string): void {
		if (this.externalWindow) {
			this.externalWindow.document.title = title;
		}
	}

	private resizeWindow(width: number, height: number): void {
		this.width = width;
		this.height = height;
		if (this.externalWindow) {
			this.externalWindow.resizeTo(width, height);
		}
	}
}

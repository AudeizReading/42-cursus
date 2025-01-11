import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { SendComponent } from '@app/components/icons/send/send.component';
import { MediaSendBarComponent } from '../media-send-bar/media-send-bar.component';
import { AlertService, ChatService } from '@app/shared';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CallType, ChatMediaAction, Profile } from '@app/models';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FileType } from '@app/models/file';
import { LoaderComponent } from '@app/components/loader/loader.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// TODO: check le resultat avec 2 personnes connectées qui chatte
@Component({
	selector: 'app-send-bar',
	standalone: true,
	imports: [SendComponent, MediaSendBarComponent, CommonModule, ReactiveFormsModule, LoaderComponent],
	templateUrl: './send-bar.component.html',
	styleUrl: './send-bar.component.scss',
})
export class SendBarComponent {
	protected form: FormGroup;
	@Input() public correspondant!: Profile;
	@Input() public user!: Profile;
	@Output() public chatCall: EventEmitter<CallType> = new EventEmitter<CallType>();

	public loadSendMedia: boolean = false;
	private destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		private chatService: ChatService,
		private formBuilder: FormBuilder,
		private alertService: AlertService,
	) {
		this.form = this.buildForm();
	}

	private buildForm(): ReturnType<typeof this.formBuilder.group> {
		return this.formBuilder.group({
			message: [''],
		});
	}

	private sendMessage(): void {
		const message = this.form.get('message')?.value;
		this.form.get('message')?.setValue('');
		if (!message) {
			this.alertService.error('Message cannot be empty', {
				keepAfterRouteChange: true,
				autoClose: true,
				fade: true,
				open: true,
			});
			return;
		}
		this.chatService
			.sendApiMessage(this.correspondant.id!, message)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (data) => {
					if (data instanceof HttpErrorResponse) {
						this.alertService.error('Message not sent');
					}
				},
				error: () => {
					this.alertService.error('Message not sent');
				},
			});
	}

	public onSend(event: Event): void {
		event.preventDefault();
		this.sendMessage();
	}

	public onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			this.sendMessage();
		}
	}
	public onSendCall(type: CallType): void {
		this.chatCall.emit(type);
	}

	public onSendMedia(event: ChatMediaAction): void {
		const { action, uploader } = event;
		this.loadSendMedia = true;
		this.chatService
			.sendApiMedia({
				type: action as FileType,
				datas: { file: uploader!, userId: this.correspondant.id! },
			})
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payloadMedia) => {
					if (payloadMedia instanceof HttpResponse) {
						this.alertService.success('Media sent', {
							keepAfterRouteChange: true,
							autoClose: true,
							fade: true,
							open: true,
						});
						this.loadSendMedia = false;
					}
				},
				error: () => {
					this.alertService.error('Media not sent', {
						keepAfterRouteChange: true,
						autoClose: true,
						fade: true,
						open: true,
					});
					this.loadSendMedia = false;
				},
			});
	}

	public onInput(event: Event): void {
		event.preventDefault();
		this.chatService.type(this.correspondant.id!);
	}
}

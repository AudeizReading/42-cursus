import { UserPublic } from '$app/user/user.interface';
import { SendCallDto } from './video-audio-chat.schema';

export type ITypeChat = 'AUDIO' | 'VIDEO';

export class ICall {
	emitterId: number;
	receiverId: number;
	rctIdEmitter: string;
	rctIdReceiver: string | undefined;
	userProfileEmiter: UserPublic;
	type: ITypeChat;
	timeout: NodeJS.Timeout | undefined;

	constructor(userId: number, userPublic: UserPublic, event: SendCallDto) {
		this.rctIdEmitter = event.rtcId;
		this.receiverId = event.userId;
		this.emitterId = userId;
		this.userProfileEmiter = userPublic;
		this.type = event.type;
	}

	authorized(a: number, b: number): boolean {
		return (
			this.emitterId == a ||
			this.emitterId == b ||
			this.receiverId == a ||
			this.emitterId == b
		);
	}

	toCall(): { user: UserPublic; type: ITypeChat } {
		return {
			user: this.userProfileEmiter,
			type: this.type,
		};
	}

	clean(): void {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = undefined;
		}
	}

	isMe(call: ICall): boolean {
		return (
			this.emitterId == call.emitterId &&
			this.receiverId == call.receiverId
		);
	}

	forMe(userId: number): boolean {
		return this.receiverId === userId;
	}
}

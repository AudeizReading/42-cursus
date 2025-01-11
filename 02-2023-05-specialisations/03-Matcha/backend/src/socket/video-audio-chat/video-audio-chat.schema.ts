import { ApiProperty } from '@nestjs/swagger';
import { ITypeChat } from './video-audio-chat.interface';
import { UserPublic } from '$app/user/user.interface';

export class SendCallDto {
	@ApiProperty()
	rtcId: string;
	@ApiProperty()
	userId: number;
	@ApiProperty({ examples: ['VIDEO', 'AUDIO'] })
	type: ITypeChat;
}

export class ReceiveCallRto {
	@ApiProperty({ type: UserPublic })
	user: UserPublic;
	@ApiProperty({ examples: ['VIDEO', 'AUDIO'] })
	type: ITypeChat;
}

export class AcceptCallDto {
	@ApiProperty()
	rtcId: string;
}

export class AcceptCallRto {
	@ApiProperty()
	rtcId: string;
}

export class UserNotAvailableRto {
	@ApiProperty()
	message: string;
}

export class EndCall {}

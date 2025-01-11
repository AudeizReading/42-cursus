import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
	@ApiProperty()
	userId: number;
	@ApiProperty({ example: 'Hello World!' })
	message: string;
}

export class SendMessageRto {
	@ApiProperty()
	status: boolean;
}

export class ReadMessageDto {
	@ApiProperty()
	messageId: number;
}

export class TyppingDto {
	@ApiProperty()
	userId: number;
}

export class TyppingRto {
	@ApiProperty()
	userId: number;
}

export class NotificationNotReadRto {
	@ApiProperty()
	unread: number;
}

export class OnlineUserStatusDto {
	@ApiProperty()
	userId: number;
	@ApiProperty()
	status: string;
}

export class UnreadMessageUserDto {
	@ApiProperty()
	userId: number;
	@ApiProperty()
	number: number;
}

export class UnreadMessageDto {
	@ApiProperty({ type: [UnreadMessageUserDto] })
	unreadMessages: UnreadMessageUserDto[];
	@ApiProperty()
	total: number;
}

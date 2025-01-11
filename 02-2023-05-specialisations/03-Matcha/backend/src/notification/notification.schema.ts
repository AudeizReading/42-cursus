import { Message } from '$app/chat/chat.schema';
import { UserPublic } from '$app/user/user.interface';
import { ApiProperty } from '@nestjs/swagger';
import { EventType } from './notification.interface';

export class Notification {
	@ApiProperty()
	id: number;
	@ApiProperty({ type: UserPublic })
	user: UserPublic;
	@ApiProperty({ type: UserPublic })
	fromUser: UserPublic;
	@ApiProperty({
		type: String,
		examples: [
			'LIKE',
			'UNLIKE',
			'VIEW',
			'MATCH',
			'MESSAGE',
			'EVENT_ACCEPTED',
			'EVENT_REFUSE',
			'NEW_EVENT',
		],
	})
	type: EventType;
	@ApiProperty({ required: false, type: Message })
	message?: Message;
	@ApiProperty()
	createdAt: Date;
	@ApiProperty()
	read: boolean;
}

export class NotificationQuery {
	@ApiProperty({ required: false })
	page?: number;
	@ApiProperty({ required: false })
	limit?: number;
}

export class NotificationQuery2 {
	@ApiProperty({
		required: false,
		description: 'Limit per result (default 5)',
	})
	limit?: number = 5;
	@ApiProperty({
		required: false,
		description: 'Return the messages up to this ID, without including it',
	})
	maxId?: number = undefined;
}

export class UnreadNotification {
	@ApiProperty()
	numberUnreadNotification: number;
}

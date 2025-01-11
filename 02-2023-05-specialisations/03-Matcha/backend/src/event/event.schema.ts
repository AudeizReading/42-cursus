import { ApiProperty } from '@nestjs/swagger';
import { EventType } from './event.interface';
import { LocationDto } from '$app/location/location.schema';
import { UserPublic } from '$app/user/user.interface';
import { OkResponseGetFileInfo } from '$app/file/file.schema';

export class Event {
	@ApiProperty()
	id: number;

	@ApiProperty({ type: LocationDto, required: false })
	location?: LocationDto;

	@ApiProperty({ type: UserPublic })
	user: UserPublic;

	@ApiProperty({ type: UserPublic })
	match: UserPublic;

	@ApiProperty()
	datetime: Date;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty({ type: OkResponseGetFileInfo, required: false })
	file?: OkResponseGetFileInfo;

	@ApiProperty({ examples: ['WAITING', 'ACCEPTED', 'REFUSE'] })
	status: EventType;
}

export class NewEventDto {
	@ApiProperty({ required: false, type: LocationDto })
	location: LocationDto;

	@ApiProperty()
	matchId: number;

	@ApiProperty()
	datetime: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty({ required: false })
	fileId?: number;
}

export class EventQuery {
	@ApiProperty({ required: false })
	page?: number;
	@ApiProperty({ required: false })
	limit?: number;
}

export class OkGetEvent {
	@ApiProperty({ type: [Event] })
	results: Event[];
	@ApiProperty()
	limit: number;
	@ApiProperty()
	currentPage: number;
}

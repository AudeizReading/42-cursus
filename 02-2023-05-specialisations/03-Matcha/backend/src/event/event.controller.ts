import { Controller } from '$app/app.decorator';
import {
	BadRequestException,
	Body,
	Get,
	Param,
	Post,
	Put,
	Query,
	Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { UseGuards } from '$app/security/security.decorator';
import { IUserLogin } from '$app/user/user.interface';
import { EventQuery, NewEventDto, OkGetEvent, Event } from './event.schema';
import { Api } from './event.decorator';

@Controller('event')
export class EventController {
	constructor(private readonly eventService: EventService) {}

	@Api('newEvent')
	@UseGuards('profilCompleted')
	@Post()
	async newEvent(
		@Request() req: IUserLogin,
		@Body() eventDto: NewEventDto,
	): Promise<Event> {
		if (
			eventDto === undefined ||
			eventDto.name === undefined ||
			eventDto.datetime === undefined ||
			eventDto.description === undefined ||
			eventDto.matchId === undefined
		) {
			throw new BadRequestException('Minimal requirement not define');
		}
		if (eventDto.matchId == req.user.getId()) {
			throw new BadRequestException('You create event just for you?');
		}
		return await this.eventService.newEvent(req.user, eventDto);
	}

	@Api('acceptEvent')
	@UseGuards('profilCompleted')
	@Put(':id/accept')
	async acceptEvent(
		@Request() req: IUserLogin,
		@Param('id') eventId: number,
	): Promise<Event> {
		return await this.eventService.accepted(req.user, eventId);
	}

	@Api('refuseEvent')
	@UseGuards('profilCompleted')
	@Put(':id/refuse')
	async refuseEvent(
		@Request() req: IUserLogin,
		@Param('id') eventId: number,
	): Promise<Event> {
		return await this.eventService.refuse(req.user, eventId);
	}

	@Api('getEvent')
	@UseGuards('profilCompleted')
	@Get()
	async getEvent(
		@Request() req: IUserLogin,
		@Query() params: EventQuery,
	): Promise<OkGetEvent> {
		if (params == undefined) params = new EventQuery();
		if (!params?.limit) params.limit = 5;
		else params.limit = Number(params.limit);
		if (!params?.page) params.page = 0;
		else params.page = Number(params.page);
		const user = req.user;
		const results = await this.eventService.getEvent(
			user,
			params.limit,
			params.page,
		);
		return {
			results,
			limit: params.limit,
			currentPage: params.page,
		};
	}
}

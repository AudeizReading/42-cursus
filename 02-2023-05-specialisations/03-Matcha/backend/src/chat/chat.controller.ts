import {
	Body,
	Get,
	Logger,
	Param,
	Post,
	Put,
	Query,
	Request,
	UnauthorizedException,
	Version,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
	SendMessageDto,
	SendMessageRto,
	UnreadMessageDto,
} from '$app/socket/socket.schema';
import { ImeRequest } from '$app/profil/profil.interface';
import { Controller } from '$app/app.decorator';
import { Api } from './chat.decorator';
import { UseGuards } from '$app/security/security.decorator';
import { GetMessageQuery, GetMessageQuery2, Message } from './chat.schema';

@Controller('chat')
export class ChatController {
	constructor(
		private readonly loggerService: Logger,
		private readonly chatService: ChatService,
	) {}

	@Api('sendMessage')
	@UseGuards('profilCompleted')
	@Post('message/send')
	async sendMessage(
		@Request() req: ImeRequest,
		@Body() values: SendMessageDto,
	): Promise<SendMessageRto> {
		console.log(values);
		let status: boolean;
		try {
			await this.chatService.sendMessage(
				req.user.getId(),
				values.userId,
				values.message,
			);
			status = true;
		} catch (err) {
			this.loggerService.error(err);
			status = false;
		}
		return { status };
	}

	@Api('getMessage')
	@Version('1')
	@UseGuards('profilCompleted')
	@Get('message/:userId')
	async getMessage(
		@Request() req: ImeRequest,
		@Param('userId') userId: string,
		@Query() getMessageQuery: GetMessageQuery,
	): Promise<Message[]> {
		if (getMessageQuery == undefined)
			getMessageQuery = new GetMessageQuery();
		if (!getMessageQuery?.limit) getMessageQuery.limit = 5;
		else getMessageQuery.limit = Number(getMessageQuery.limit);
		if (!getMessageQuery?.page) getMessageQuery.page = 0;
		else getMessageQuery.page = Number(getMessageQuery.page);
		if (
			!(await this.chatService.accessOnMessage(
				req.user,
				Number.parseInt(userId),
			))
		) {
			throw new UnauthorizedException(
				'You do not have access to this conversation',
			);
		}
		return await this.chatService.getMessage(
			req.user.getId(),
			Number.parseInt(userId),
			getMessageQuery.limit,
			getMessageQuery.page,
		);
	}

	@Api('getMessage')
	@Version('2')
	@UseGuards('profilCompleted')
	@Get('message/:userId')
	async getMessageById(
		@Request() req: ImeRequest,
		@Param('userId') userId: string,
		@Query() getMessageQuery: GetMessageQuery2,
	): Promise<Message[]> {
		if (getMessageQuery == undefined)
			getMessageQuery = new GetMessageQuery2();
		if (!getMessageQuery?.limit) getMessageQuery.limit = 5;
		else getMessageQuery.limit = Number(getMessageQuery.limit);
		if (
			!(await this.chatService.accessOnMessage(
				req.user,
				Number.parseInt(userId),
			))
		) {
			throw new UnauthorizedException(
				'You do not have access to this conversation',
			);
		}
		return await this.chatService.getMessageById(
			req.user.getId(),
			Number.parseInt(userId),
			getMessageQuery.limit,
			getMessageQuery?.maxId,
		);
	}

	@Api('readMessage')
	@UseGuards('profilCompleted')
	@Put('message/read/:messageId')
	async readMessage(
		@Request() req: ImeRequest,
		@Param('messageId') messageId: string,
	): Promise<void> {
		await this.chatService.readMessage(
			req.user.getId(),
			Number.parseInt(messageId),
		);
	}

	@Api('unreadMessage')
	@UseGuards('profilCompleted')
	@Get('unread')
	async unreadMessage(@Request() req: ImeRequest): Promise<UnreadMessageDto> {
		return await this.chatService.unreadMessage(req.user.getId());
	}
}

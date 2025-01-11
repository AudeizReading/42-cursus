import { Controller } from '$app/app.decorator';
import {
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	Request,
	Version,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { IUserLogin } from '$app/user/user.interface';
import { UseGuards } from '$app/security/security.decorator';
import {
	Notification,
	NotificationQuery,
	NotificationQuery2,
	UnreadNotification,
} from './notification.schema';
import { Api } from './notification.decorator';

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Api('deleteNotification')
	@UseGuards('profilCompleted')
	@Delete(':notificationId')
	async deleteNotification(
		@Request() req: IUserLogin,
		@Param('notificationId') notificationId: string,
	): Promise<void> {
		await this.notificationService.deleteNotification(
			req.user,
			Number.parseInt(notificationId),
		);
	}

	@Api('readNotification')
	@UseGuards('profilCompleted')
	@Put(':notificationId')
	async readNotification(
		@Request() req: IUserLogin,
		@Param('notificationId') notificationId: string,
	): Promise<void> {
		await this.notificationService.readNotification(
			req.user,
			Number.parseInt(notificationId),
		);
	}

	@Api('getNumberUnreadNotification')
	@UseGuards('profilCompleted')
	@Get('unread')
	async getNumberUnreadNotification(
		@Request() req: IUserLogin,
	): Promise<UnreadNotification> {
		return {
			numberUnreadNotification:
				await this.notificationService.getNumberUnreadNotification(
					req.user,
				),
		};
	}

	@Api('getNotifications')
	@Version('1')
	@UseGuards('profilCompleted')
	@Get()
	@HttpCode(200)
	async getNotifications(
		@Request() req: IUserLogin,
		@Query() query: NotificationQuery,
	): Promise<Notification[]> {
		if (query == undefined) query = new NotificationQuery();
		if (!query?.limit) query.limit = 5;
		else query.limit = Number(query.limit);
		if (!query?.page) query.page = 0;
		else query.page = Number(query.page);
		return await this.notificationService.getNotifications(
			req.user,
			query.limit,
			query.page,
		);
	}

	@Api('getNotifications')
	@Version('2')
	@UseGuards('profilCompleted')
	@Get()
	@HttpCode(200)
	async getNotifications2(
		@Request() req: IUserLogin,
		@Query() query: NotificationQuery2,
	): Promise<Notification[]> {
		if (query == undefined) query = new NotificationQuery2();
		if (!query?.limit) query.limit = 5;
		else query.limit = Number(query.limit);
		return await this.notificationService.getNotificationsById(
			req.user,
			query.limit,
			query.maxId,
		);
	}
}

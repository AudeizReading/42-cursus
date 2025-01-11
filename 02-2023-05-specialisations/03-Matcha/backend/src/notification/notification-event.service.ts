import { ChatService } from '$app/chat/chat.service';
import { ADatabase } from '$app/database/ADatabase';
import { LikeService } from '$app/like/like.service';
import { UserService } from '$app/user/user.service';
import { ViewService } from '$app/view/view.service';
import { Injectable, Logger } from '@nestjs/common';
import { EventType } from './notification.interface';
import { EventEmitter } from 'events';
import { EventService } from '$app/event/event.service';

@Injectable()
export class NotificationEventService {
	private loggerService: Logger;
	static eventEmitter = new EventEmitter();

	constructor() {
		this.loggerService = new Logger();
		if (process.env.NODE_ENV == 'test' || process.env.TEST == 'true')
			NotificationEventService.eventEmitter.setMaxListeners(0);
	}

	async eventUpdate(
		value: ADatabase<unknown, unknown, unknown>,
	): Promise<void> {
		switch (value.getTableName()) {
			case 'like':
				const likeService = value as LikeService;
				this.loggerService.log(
					`user ${likeService.getUserId()} like ${likeService.getLikeId()}`,
					'NotificationEventService',
				);
				await this.event(
					'LIKE',
					likeService.getUserId(),
					likeService.getLikeId(),
				);
				await this.eventMatch(
					likeService.getUserId(),
					likeService.getLikeId(),
				);
				break;
			case 'view':
				const viewService = value as ViewService;
				this.loggerService.log(
					`user ${viewService.getUserId()} view ${viewService.getViewId()}`,
					'NotificationEventService',
				);
				await this.event(
					'VIEW',
					viewService.getUserId(),
					viewService.getViewId(),
				);
				break;
			case 'message':
				const chatService = value as ChatService;
				if (
					(chatService.getFileId() || chatService.getMessageBrut()) &&
					!chatService.getRead()
				) {
					this.loggerService.log(
						// eslint-disable-next-line max-len
						`user ${chatService.getSendId()} send message ${chatService.getId()} for ${chatService.getReceiveId()}`,
						'NotificationEventService',
					);
					await this.event(
						'MESSAGE',
						chatService.getSendId(),
						chatService.getReceiveId(),
						chatService.getId(),
					);
				}
				break;
			case 'event':
				const eventService = value as EventService;
				switch (eventService.getStatus()) {
					case 'WAITING':
						this.loggerService.log(
							// eslint-disable-next-line max-len
							`user ${eventService.getUserId()} send event for ${eventService.getMatchId()}`,
							'NotificationEventService',
						);
						await this.event(
							'NEW_EVENT',
							eventService.getUserId(),
							eventService.getMatchId(),
						);
						break;
					case 'ACCEPTED':
						this.loggerService.log(
							// eslint-disable-next-line max-len
							`user ${eventService.getMatchId()} accept event ${eventService.getId()}`,
							'NotificationEventService',
						);
						await this.event(
							'EVENT_ACCEPTED',
							eventService.getMatchId(),
							eventService.getUserId(),
						);
						break;
					case 'REFUSE':
						this.loggerService.log(
							// eslint-disable-next-line max-len
							`user ${eventService.getMatchId()} refuse event ${eventService.getId()}`,
							'NotificationEventService',
						);
						await this.event(
							'EVENT_REFUSE',
							eventService.getMatchId(),
							eventService.getUserId(),
						);
						break;
				}
		}
	}

	async eventUnlike(
		likeService: LikeService,
		userId: number,
		likeId: number,
	): Promise<void> {
		likeService.setUserId(userId);
		if (await likeService.profilIsLiked(likeId)) {
			this.loggerService.log(
				`user ${userId} unlike ${likeId}`,
				'NotificationEventService',
			);
			await this.event('UNLIKE', userId, likeId);
		}
	}

	private async eventMatch(userId: number, likeId: number): Promise<void> {
		const userService = new UserService();
		const user = await userService.getByPK(userId);
		const liked = await userService.getByPK(likeId);
		if (await user.isMatch(liked)) {
			this.loggerService.log(
				`Match: ${userId} and ${likeId}`,
				'NotificationEventService',
			);
			await Promise.all([
				this.event('MATCH', userId, likeId),
				this.event('MATCH', likeId, userId),
			]);
		}
	}

	private async event(
		type: EventType,
		ofUserId: number,
		forUserId: number,
		messageId?: number,
	): Promise<void> {
		const userService = new UserService();
		const ofUser = await userService.getByPK(ofUserId);
		const forUser = await userService.getByPK(forUserId);
		if (await forUser.isBlocked(ofUser)) {
			this.loggerService.warn(
				`Send notification is cancel blocked detected`,
			);
			return;
		}
		NotificationEventService.eventEmitter.emit(
			'notification',
			type,
			ofUser,
			forUser,
			messageId,
		);
	}
}

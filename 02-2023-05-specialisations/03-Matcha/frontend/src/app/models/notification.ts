import { ProfileDTO } from '.';
import { ApiQuery } from './api';
import { MessageRTO } from './socket';

export type NotificationLevelType = 'ERROR' | 'WARN' | 'SUCCESS' | 'ACTION';

export type NotificationType =
	| 'LIKE'
	| 'UNLIKE'
	| 'VIEW'
	| 'MATCH'
	| 'MESSAGE'
	| 'EVENT_ACCEPTED'
	| 'EVENT_REFUSE'
	| 'NEW_EVENT';

export interface NotificationAPIQueryDTO extends ApiQuery {
	limit: number;
	page: number;
}

export interface NotificationAPIV2QueryDTO extends ApiQuery {
	limit: number;
	maxId?: number;
}

export interface NbNotificationsResponseDTO {
	numberUnreadNotification: number;
}

export interface NotificationResponseDTO {
	id: number;
	user: ProfileDTO | null;
	fromUser: ProfileDTO | null;
	type: NotificationType | null;
	message: MessageRTO | null;
	createdAt: string;
	read: boolean;
}

export class Notification {
	public readonly id: number = 0;
	public readonly senderId: number = 0;
	public readonly url: string = '';
	public readonly name: string = '';
	public isRead: boolean = false;
	public readonly labelButton: string = '';
	public readonly message: string = '';
	public readonly type: NotificationType | null = null;

	public constructor(init: NotificationResponseDTO) {
		if (!init) return;
		this.id = init.id;
		this.url = init.fromUser!.defaultPicture.url;
		this.senderId = init.fromUser!.id;
		this.name = init.fromUser!.username;
		this.isRead = init.read;
		this.type = init.type;
		const { label, message } = this.normalizeLabelAndMessage(init.type!);
		this.labelButton = label;
		this.message = message;
	}

	public static normalizeArray(notifs: NotificationResponseDTO[]): Notification[] {
		return notifs.map((notif) => new Notification(notif));
	}

	public normalizeTypeNotification(type?: NotificationType): string {
		switch (type || this.type) {
			case 'LIKE':
				return 'You get a new like from';
			case 'UNLIKE':
				return 'You have lost the like of';
			case 'VIEW':
				return 'You have a new view of your profile from';
			case 'MATCH':
				return 'You have a new match with';
			case 'MESSAGE':
				return 'You have a new message from';
			case 'EVENT_ACCEPTED':
				return 'You have a new event notification from';
			case 'EVENT_REFUSE':
				return 'You have a new event notification from';
			case 'NEW_EVENT':
				return 'You have a new event notification from';
		}
		return '';
	}

	public normalizeLabelAndMessage(type: NotificationType): { label: string; message: string } {
		let label: string = 'View Profile',
			message: string = '';

		switch (type) {
			case 'LIKE':
				label = 'Like back';
				message = 'Just liked you';
				break;
			case 'UNLIKE':
				message = 'Just unliked you';
				break;
			case 'VIEW':
				message = 'Viewed your profile';
				break;
			case 'MATCH':
				message = 'You have a match';
				label = "Let's Chat";
				break;
			case 'MESSAGE':
				label = 'Read';
				message = 'Sent you a message';
				break;
			case 'EVENT_ACCEPTED':
				message = 'Accepted your event';
				label = 'View Event';
				break;
			case 'EVENT_REFUSE':
				message = 'Refused your event';
				label = 'View Event';
				break;
			case 'NEW_EVENT':
				message = 'Just invited you to an event';
				label = 'View Event';
				break;
		}

		return { label, message };
	}
}

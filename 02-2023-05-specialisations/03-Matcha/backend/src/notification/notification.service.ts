import {
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import {
	EventType,
	IDatabaseNotification,
	INotification,
} from './notification.interface';
import { ADatabaseRelationUser } from '$app/database/ADatabaseRelationUser';
import { UserService } from '$app/user/user.service';
import { ChatService } from '$app/chat/chat.service';
import { Notification } from './notification.schema';
import { UserPublic } from '$app/user/user.interface';
import { Message } from '$app/chat/chat.schema';
import { ADatabase } from '$app/database/ADatabase';
import { SocketService } from '$app/socket/socket.service';

@Injectable()
export class NotificationService extends ADatabaseRelationUser<
	IDatabaseNotification,
	NotificationService,
	INotification
> {
	private fromUserId: number;
	private type: EventType;
	private messageId?: number;
	private createdAt: Date;
	private read: boolean;

	constructor() {
		super(NotificationService, 'notification');
		this.userService = new UserService();
	}

	setFromUserId(userId: number): void {
		this.fromUserId = userId;
	}

	setFromUser(user: UserService): void {
		this.setFromUserId(user.getId());
	}

	getFromUserId(): number {
		return this.fromUserId;
	}

	setType(event: EventType): void {
		this.type = event;
	}

	getType(): EventType {
		return this.type;
	}

	setMessageId(messageId: number): void {
		this.messageId = messageId;
	}

	getMessageId(): number | undefined {
		return this.messageId;
	}

	setCreatedAt(timestamp: number): void {
		this.createdAt = new Date(timestamp);
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}

	setRead(value: boolean): void {
		this.read = value;
	}

	isRead(): boolean {
		return this.read;
	}

	deserialize(db: IDatabaseNotification): void {
		this.setId(db.id);
		this.setUserId(db.userId);
		this.setFromUserId(db.fromUserId);
		this.setType(db.type as EventType);
		if (db.messageId) this.setMessageId(db.messageId);
		this.setCreatedAt(db.createdAt);
		this.setRead(db.read == 1 ? true : false);
	}

	normalize(): INotification {
		const { id, userId, type, fromUserId, messageId, createdAt, read } =
			this;
		return {
			id,
			userId,
			type,
			fromUserId,
			messageId,
			createdAt,
			read,
		};
	}

	async getUserPublic(): Promise<UserPublic> {
		const user = await this.getUser();
		return await user.getPublic();
	}

	async getFromUserPublic(): Promise<UserPublic> {
		const userService = new UserService();
		const user = await userService.getByPK(this.getFromUserId());
		return await user.getPublic();
	}

	async getMessage(): Promise<Message | undefined> {
		try {
			const messageId = this.getMessageId();
			if (messageId == undefined) return undefined;
			const chatService = new ChatService();
			const message = (await chatService.getByPK(messageId)).normalize();
			return await chatService.interfaceToMessage(message);
		} catch (err) {
			Logger.error(`getMessage() ${err}`, 'NotificationService');
			return undefined;
		}
	}

	async toNotification(): Promise<Notification> {
		const msg = await this.getMessage();
		const user = await this.getUserPublic();
		const fromUser = await this.getFromUserPublic();
		const values = {
			id: this.getId(),
			user,
			fromUser,
			type: this.getType(),
			createdAt: this.getCreatedAt(),
			read: this.isRead(),
		};
		if (msg) {
			return { ...values, message: msg };
		}
		return values;
	}

	async newNotification(
		type: EventType,
		fromUser: UserService,
		user: UserService,
		messageId?: number,
	): Promise<Notification> {
		const notification = this.newInstance();
		if (messageId) notification.setMessageId(messageId);
		notification.setType(type);
		notification.setFromUser(fromUser);
		notification.setUser(user);
		notification.createdAt = new Date();
		notification.setRead(false);
		await notification.update();
		return notification.toNotification();
	}

	async deleteNotification(
		user: UserService,
		notificationId: number,
	): Promise<void> {
		let notif: NotificationService;
		try {
			notif = await this.getByPK(notificationId);
		} catch {
			throw new NotFoundException('Notification not found');
		}
		if (notif.getUserId() != user.getId()) {
			throw new UnauthorizedException('This notification is not for you');
		}
		await notif.delete();
		await SocketService.sendUnreadNotification(user.getId());
	}

	async readNotification(
		user: UserService,
		notificationId: number,
	): Promise<boolean> {
		let notif: NotificationService;
		try {
			notif = await this.getByPK(notificationId);
		} catch {
			throw new NotFoundException('Notification not found');
		}
		if (notif.getUserId() != user.getId()) {
			throw new UnauthorizedException('This notification is not for you');
		}
		notif.setRead(true);
		await notif.update();
		await SocketService.sendUnreadNotification(user.getId());
		return true;
	}

	async getNumberUnreadNotification(user: UserService): Promise<number> {
		return await this.getNumberUnreadNotificationByUserId(user.getId());
	}

	async getNumberUnreadNotificationByUserId(userId: number): Promise<number> {
		const sql = `SELECT COUNT(*) FROM notification \
		WHERE userId = ${userId} AND read = 0;`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((res) => {
				return res[0]['COUNT(*)'] as number;
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}

	async getNotifications(
		user: UserService,
		limit: number,
		page: number,
	): Promise<Notification[]> {
		const offset = page * limit;
		const sql = `SELECT * FROM notification
				WHERE userId = ${user.getId()}
			ORDER BY id DESC
			LIMIT ${limit}
			OFFSET ${offset};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows: IDatabaseNotification[]) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		const values = await result
			.then((res: IDatabaseNotification[]) => {
				return res.map((r) => {
					const notificationService = this.newInstance();
					notificationService.deserialize(r);
					return notificationService;
				});
			})
			.catch((err) => {
				throw new Error(err.message);
			});
		return await Promise.all(
			values.map(async (v) => await v.toNotification()),
		);
	}

	async getNotificationsById(
		user: UserService,
		limit: number,
		maxId?: number,
	): Promise<Notification[]> {
		const sql = `SELECT * FROM notification
				WHERE userId = ${user.getId()}
				${maxId !== undefined ? `AND id < ${maxId}` : ''}
			ORDER BY id DESC
			LIMIT ${limit};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows: IDatabaseNotification[]) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		const values = await result
			.then((res: IDatabaseNotification[]) => {
				return res.map((r) => {
					const notificationService = this.newInstance();
					notificationService.deserialize(r);
					return notificationService;
				});
			})
			.catch((err) => {
				throw new Error(err.message);
			});
		return await Promise.all(
			values.map(async (v) => await v.toNotification()),
		);
	}
}

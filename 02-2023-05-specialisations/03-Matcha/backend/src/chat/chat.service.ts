import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { IChat, IDatabaseChat } from './chat.interface';
import { ADatabase } from '$app/database/ADatabase';
import { UserService } from '$app/user/user.service';
import { FileService } from '$app/file/file.service';
import { Message } from './chat.schema';
import { SocketService } from '$app/socket/socket.service';
import {
	UnreadMessageDto,
	UnreadMessageUserDto,
} from '$app/socket/socket.schema';

@Injectable()
export class ChatService extends ADatabase<IDatabaseChat, ChatService, IChat> {
	private sendId: number;
	private receiveId: number;
	private message?: string;
	private fileId?: number;
	private read: boolean;
	private loggerService: Logger;

	constructor() {
		super(ChatService, 'message', ['loggerService']);
		this.loggerService = new Logger();
	}

	setSendId(userId: number): void {
		this.sendId = userId;
	}

	getSendId(): number {
		return this.sendId;
	}

	setSender(user: UserService): void {
		this.setSendId(user.getId());
	}

	setReceiveId(userId: number): void {
		this.receiveId = userId;
	}

	getReceiveId(): number {
		return this.receiveId;
	}

	setReceiver(user: UserService): void {
		this.setReceiveId(user.getId());
	}

	setMessage(msg: string): void {
		this.message = msg;
	}

	getMessageBrut(): string {
		return this.message;
	}

	getFileId(): number {
		return this.fileId;
	}

	setFileId(fileId: number): void {
		this.fileId = fileId;
	}

	setFile(file: FileService): void {
		this.setFileId(file.getId());
	}

	setRead(value: boolean): void {
		this.read = value;
	}

	getRead(): boolean {
		return this.read;
	}

	deserialize(db: IDatabaseChat): void {
		this.setId(db.id);
		this.setSendId(db.sendId);
		this.setReceiveId(db.receiveId);
		this.setFileId(db.fileId);
		this.setMessage(db.message);
		this.setRead(db.read == 1 ? true : false);
	}

	normalize(): IChat {
		const { id, sendId, receiveId, message, fileId, read } = this;
		return {
			id,
			sendId,
			receiveId,
			message,
			fileId,
			read,
		};
	}

	async rightSend(
		sender: UserService,
		receive: UserService,
	): Promise<boolean> {
		if (sender.getId() == receive.getId()) {
			return false;
		}
		if (!(await sender.isMatch(receive))) {
			return false;
		}
		if (!(await sender.isComplete()) || !(await receive.isComplete())) {
			return false;
		}
		if (
			(await sender.isBlocked(receive)) ||
			(await receive.isBlocked(sender))
		) {
			return false;
		}
		return true;
	}

	async sendMessage(
		senderId: number,
		receiveId: number,
		msg: string,
	): Promise<void> {
		const userService = new UserService();
		return await this.sendMessageByUser(
			await userService.getByPK(senderId),
			await userService.getByPK(receiveId),
			msg,
		);
	}

	async interfaceToMessage(v: IChat | IDatabaseChat): Promise<Message> {
		const userService = new UserService();
		const fileService = new FileService();
		const id = v.id;
		const senderId = v.sendId;
		const receiveId = v.receiveId;
		const read =
			typeof v.read == 'boolean' ? v.read : v.read == 1 ? true : false;
		let ret: Message = {
			id,
			sender: await (await userService.getByPK(senderId)).getPublic(),
			receiver: await (await userService.getByPK(receiveId)).getPublic(),
			read,
		};
		if (v.message) {
			ret = {
				...ret,
				message: v.message,
			};
		}
		if (v.fileId) {
			ret = {
				...ret,
				file: (await fileService.getByPK(v.fileId)).normalize(),
			};
		}
		return ret;
	}

	async sendMessageByUser(
		sender: UserService,
		receive: UserService,
		msg: string,
	): Promise<void> {
		if (!(await this.rightSend(sender, receive))) {
			throw new Error('Right check fail');
		}
		const chatService = this.newInstance();
		chatService.setMessage(msg);
		chatService.setSender(sender);
		chatService.setReceiver(receive);
		chatService.setRead(false);
		await chatService.update();
		await SocketService.sendMessageUser(
			await this.interfaceToMessage(chatService.normalize()),
		);
	}

	async getMessage(
		userId: number,
		withId: number,
		limit: number,
		page: number,
	): Promise<Message[]> {
		const offset = page * limit;
		const sql = `SELECT * FROM message
				WHERE (sendId = ${userId} AND receiveId = ${withId})
				OR (receiveId = ${userId} AND sendId = ${withId})
			ORDER BY id DESC
			LIMIT ${limit}
			OFFSET ${offset};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows: IDatabaseChat[]) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		const values = await result
			.then((res: IDatabaseChat[]) => res)
			.catch((err) => {
				throw new Error(err.message);
			});
		return await Promise.all(
			values.map(async (v) => await this.interfaceToMessage(v)),
		);
	}

	async getMessageById(
		userId: number,
		withId: number,
		limit: number,
		maxId?: number,
	): Promise<Message[]> {
		const sql = `SELECT * FROM message
				WHERE ((sendId = ${userId} AND receiveId = ${withId})
				OR (receiveId = ${userId} AND sendId = ${withId}))
				${maxId !== undefined ? `AND id < ${maxId}` : ''}
			ORDER BY id DESC
			LIMIT ${limit};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows: IDatabaseChat[]) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		const values = await result
			.then((res: IDatabaseChat[]) => res)
			.catch((err) => {
				throw new Error(err.message);
			});
		return await Promise.all(
			values.map(async (v) => await this.interfaceToMessage(v)),
		);
	}

	async readMessage(
		userIdReadMessage: number,
		messageId: number,
	): Promise<void> {
		const message = await this.getByPK(messageId);
		if (userIdReadMessage != message.receiveId) {
			throw new UnauthorizedException('This message is not for you');
		}
		message.setRead(true);
		await message.update();
		await SocketService.sendUnreadMessage(userIdReadMessage);
	}

	async sendFile(
		senderId: number,
		receiveId: number,
		fileId: number,
	): Promise<void> {
		const userService = new UserService();
		const fileService = new FileService();
		return await this.sendFileByUser(
			await userService.getByPK(senderId),
			await userService.getByPK(receiveId),
			await fileService.getByPK(fileId),
		);
	}

	async sendFileByUser(
		sender: UserService,
		receive: UserService,
		file: FileService,
	): Promise<void> {
		if (!(await this.rightSend(sender, receive))) {
			throw new Error('Right check fail');
		}
		const chatService = this.newInstance();
		chatService.setFile(file);
		chatService.setSender(sender);
		chatService.setReceiver(receive);
		chatService.setRead(false);
		await chatService.update();
		await SocketService.sendMessageUser(
			await this.interfaceToMessage(chatService.normalize()),
		);
	}

	async unreadMessage(userId: number): Promise<UnreadMessageDto> {
		const sql = `
			SELECT
				m.sendId AS userId,
				COUNT(*) AS number
			FROM
				message m
			JOIN
				"like" l1 ON l1.likeId = m.sendId AND l1.userId = ${userId}
			JOIN
				"like" l2 ON l2.likeId = ${userId} AND l2.userId = m.sendId
			LEFT JOIN
				block b1 ON b1.blockId = m.sendId AND b1.userId = ${userId}
			LEFT JOIN
				block b2 ON b2.userId = m.sendId AND b2.blockId = ${userId}
			WHERE
				m.receiveId = ${userId}
				AND m.read = 0
				AND b1.id IS NULL
				AND b2.id IS NULL
			GROUP BY
				m.sendId;
		`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows: UnreadMessageUserDto[]) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((data: UnreadMessageUserDto[]) => {
				return {
					unreadMessages: data,
					total: data.reduce((accumulator, currentValue) => {
						return accumulator + currentValue.number;
					}, 0),
				};
			})
			.catch((err) => {
				this.loggerService.error(err, 'ChatService');
				return { unreadMessages: [], total: 0 };
			});
	}

	async accessOnMessage(user: UserService, userId: number): Promise<boolean> {
		const userService = new UserService();
		const convUser = await userService.getByPK(userId);
		if (await user.isBlocked(convUser)) return false;
		if (await convUser.isBlocked(user)) return false;
		return true;
	}
}

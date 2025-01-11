import { ADatabaseRelationUser } from '$app/database/ADatabaseRelationUser';
import { UserService } from '$app/user/user.service';
import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { EventType, IDatabaseEvent, IEvent } from './event.interface';
import { Event, NewEventDto } from './event.schema';
import { OkResponseGetFileInfo } from '$app/file/file.schema';
import { FileService } from '$app/file/file.service';
import { UserPublic } from '$app/user/user.interface';
import { LocationDto } from '$app/location/location.schema';
import { ADatabase } from '$app/database/ADatabase';

@Injectable()
export class EventService extends ADatabaseRelationUser<
	IDatabaseEvent,
	EventService,
	IEvent
> {
	private latitude?: number | undefined;
	private longitude?: number | undefined;
	private matchId: number;
	private datetime?: Date;
	private name: string;
	private description: string;
	private fileId?: number;
	private status: EventType;

	constructor() {
		super(EventService, 'event');
		this.userService = new UserService();
	}

	normalize(): IEvent {
		const {
			id,
			userId,
			latitude,
			longitude,
			matchId,
			datetime,
			name,
			description,
			fileId,
			status,
		} = this;
		const values = {
			id,
			userId,
			latitude,
			longitude,
			matchId,
			datetime,
			name,
			description,
			status,
		};
		if (fileId) {
			return {
				...values,
				fileId,
			};
		}
		return values;
	}

	setFileId(fileId: number): void {
		this.fileId = fileId;
	}

	setLocation(locationDto: LocationDto): void {
		this.longitude = locationDto.longitude;
		this.latitude = locationDto.latitude;
	}

	setDateTime(timeStamp: number): void {
		this.datetime = new Date(timeStamp);
	}

	setDescription(description: string): void {
		this.description = description;
	}

	setName(name: string): void {
		this.name = name;
	}

	setMatchUser(match: UserService): void {
		this.setMatchId(match.getId());
	}

	setMatchId(matchId: number): void {
		this.matchId = matchId;
	}

	setStatus(status: EventType): void {
		this.status = status;
	}

	deserialize(db: IDatabaseEvent): void {
		this.setId(db.id);
		this.setUserId(db.userId);
		if (db.fileId) this.setFileId(db.fileId);
		if (db.latitude && db.longitude)
			this.setLocation({
				latitude: db.latitude,
				longitude: db.longitude,
			});
		this.setDateTime(db.datetime);
		this.setDescription(db.description);
		this.setName(db.name);
		this.setMatchId(db.matchId);
		this.setStatus(db.status as EventType);
	}

	getFileId(): number | undefined {
		return this.fileId;
	}

	async getFile(): Promise<OkResponseGetFileInfo | undefined> {
		if (this.getFileId() == undefined) return undefined;
		const fileService = new FileService();
		const file = await fileService.getById(this.getFileId());
		if (file.getType() != 'PICTURE' && file.getContext() != 'EVENT')
			return undefined;
		return file.normalize();
	}

	getMatchId(): number {
		return this.matchId;
	}

	async getMatch(): Promise<UserService> {
		const userService = new UserService();
		return await userService.getByPK(this.getMatchId());
	}

	async getUserPublic(): Promise<UserPublic> {
		const user = await this.getUser();
		return await user.getPublic();
	}

	async getMatchPublic(): Promise<UserPublic> {
		const user = await this.getMatch();
		return await user.getPublic();
	}

	getStatus(): EventType {
		return this.status;
	}

	getDateTime(): Date {
		return this.datetime;
	}

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}

	getLatitude(): number | undefined {
		return this.latitude;
	}

	getLongitude(): number | undefined {
		return this.longitude;
	}

	getLocation(): LocationDto | undefined {
		if (
			this.getLatitude() === undefined ||
			this.getLongitude() === undefined
		)
			return undefined;
		return {
			latitude: this.getLatitude(),
			longitude: this.getLongitude(),
		};
	}

	async toEvent(): Promise<Event> {
		const file = await this.getFile();
		const location = this.getLocation();
		let values: Event = {
			id: this.getId(),
			user: await this.getUserPublic(),
			match: await this.getMatchPublic(),
			datetime: this.getDateTime(),
			name: this.getName(),
			description: this.getDescription(),
			status: this.getStatus(),
		};
		if (file) {
			values = {
				...values,
				file,
			};
		}
		if (location) {
			values = {
				...values,
				location,
			};
		}
		return values;
	}

	async newEvent(user: UserService, event: NewEventDto): Promise<Event> {
		const eventService = this.newInstance();
		eventService.setUser(user);
		if (event.location) eventService.setLocation(event.location);
		if (event.fileId) eventService.setFileId(event.fileId);
		eventService.setStatus('WAITING');
		eventService.setMatchId(event.matchId);
		eventService.setDescription(event.description);
		eventService.setDateTime(new Date(event.datetime).getTime());
		eventService.setName(event.name);
		await eventService.update();
		return await eventService.toEvent();
	}

	private async changeStatusEvent(
		user: UserService,
		eventId: number,
		status: EventType,
	): Promise<Event> {
		try {
			const eventService = this.newInstance();
			const event = await eventService.getByPK(eventId);
			if (event.getMatchId() != user.getId()) {
				throw new UnauthorizedException();
			}
			if (event.getStatus() != 'WAITING') {
				throw new ConflictException('Status already change');
			}
			event.setStatus(status);
			await event.update();
			return await event.toEvent();
		} catch {
			throw new NotFoundException('Event not found');
		}
	}

	async accepted(user: UserService, eventId: number): Promise<Event> {
		return await this.changeStatusEvent(user, eventId, 'ACCEPTED');
	}

	async refuse(user: UserService, eventId: number): Promise<Event> {
		return await this.changeStatusEvent(user, eventId, 'REFUSE');
	}

	async getEvent(
		user: UserService,
		limit: number,
		page: number,
	): Promise<Event[]> {
		const offset = page * limit;
		const sql = `SELECT e.*
			FROM event e
			JOIN "like" l1 ON e.userId = l1.userId AND e.matchId = l1.likeId
			JOIN "like" l2 ON e.matchId = l2.userId AND e.userId = l2.likeId
			LEFT JOIN block b1 ON e.userId = b1.userId AND e.matchId = b1.blockId
			LEFT JOIN block b2 ON e.matchId = b2.userId AND e.userId = b2.blockId
			WHERE (e.userId = ${user.getId()} OR e.matchId = ${user.getId()})
			AND b1.userId IS NULL AND b2.userId IS NULL
			ORDER BY e.id DESC
			LIMIT ${limit}
			OFFSET ${offset};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows: IDatabaseEvent[]) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		const values = await result
			.then((res: IDatabaseEvent[]) => {
				return res.map((r) => {
					const notificationService = this.newInstance();
					notificationService.deserialize(r);
					return notificationService;
				});
			})
			.catch((err) => {
				throw new Error(err.message);
			});
		return await Promise.all(values.map(async (v) => await v.toEvent()));
	}
}

import { ADatabaseRelationUser } from '$app/database/ADatabaseRelationUser';
import { IDatabaseLocation, ILocation } from './location.interface';
import { UserService } from '$app/user/user.service';
import { Logger } from '@nestjs/common';

export abstract class ALocation<
	SERVICE extends ALocation<SERVICE>,
> extends ADatabaseRelationUser<IDatabaseLocation, SERVICE, ILocation> {
	private latitude: number;
	private longitude: number;
	private createdAt: Date;
	private updatedAt: Date;

	constructor(
		instance: new () => SERVICE,
		tableName: string,
		forbiddenTag: string[] = [],
	) {
		super(instance, tableName, forbiddenTag);
	}

	setLatitude(lat: number): void {
		this.latitude = lat;
	}

	setLongitude(lon: number): void {
		this.longitude = lon;
	}

	setCreatedAt(timestamp: number): void {
		this.createdAt = new Date(timestamp);
	}

	setUpdatedAt(timestamp: number): void {
		this.updatedAt = new Date(timestamp);
	}

	getUpdatedAt(): Date {
		return this.updatedAt;
	}

	deserialize(db: IDatabaseLocation): void {
		this.setId(db.id);
		this.setUserId(db.userId);
		this.setLatitude(db.latitude);
		this.setLongitude(db.longitude);
		this.setCreatedAt(db.createdAt);
		this.setUpdatedAt(db.updatedAt);
	}

	async findLocationByUser(user: UserService): Promise<SERVICE> {
		return await this.findLocationByUserId(user.getId());
	}

	async findLocationByUserId(userId: number): Promise<SERVICE> {
		const locationIPServices = await this.get(userId, 'userId');
		if (locationIPServices.length != 1) throw new Error('Not found');
		return locationIPServices[0];
	}

	async updateLocationByUser(
		user: UserService,
		latitude: number,
		longitude: number,
	): Promise<void> {
		try {
			if (latitude == undefined || longitude == undefined) return;
			return await this.updateLocationByUserId(
				user.getId(),
				latitude,
				longitude,
			);
		} catch (err) {
			Logger.error(err, 'ALocation');
		}
	}

	async updateLocationByUserId(
		userId: number,
		latitude: number,
		longitude: number,
	): Promise<void> {
		const currentDate = new Date().getTime();
		let locationIPService: ALocation<SERVICE>;
		try {
			locationIPService = await this.findLocationByUserId(userId);
		} catch {
			locationIPService = this.newInstance();
			locationIPService.setCreatedAt(currentDate);
		}
		locationIPService.setLatitude(latitude);
		locationIPService.setLongitude(longitude);
		locationIPService.setUpdatedAt(currentDate);
		locationIPService.setUserId(userId);
		await locationIPService.update();
	}

	normalize(): ILocation {
		const { id, userId, latitude, longitude, createdAt, updatedAt } = this;
		return {
			id,
			userId,
			latitude,
			longitude,
			createdAt,
			updatedAt,
		};
	}
}

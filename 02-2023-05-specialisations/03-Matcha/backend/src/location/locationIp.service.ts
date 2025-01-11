import { Injectable } from '@nestjs/common';
import { ALocation } from './ALocation';
import { UserService } from '$app/user/user.service';

@Injectable()
export class LocationIPService extends ALocation<LocationIPService> {
	constructor() {
		super(LocationIPService, 'locationIP');
		this.userService = new UserService();
	}
}

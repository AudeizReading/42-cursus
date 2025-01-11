import { Injectable } from '@nestjs/common';
import { ALocation } from './ALocation';
import { UserService } from '$app/user/user.service';

@Injectable()
export class LocationNavigatorService extends ALocation<LocationNavigatorService> {
	constructor() {
		super(LocationNavigatorService, 'locationNavigator');
		this.userService = new UserService();
	}
}

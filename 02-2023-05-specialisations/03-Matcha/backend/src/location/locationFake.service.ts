import { Injectable } from '@nestjs/common';
import { ALocation } from './ALocation';
import { UserService } from '$app/user/user.service';

@Injectable()
export class LocationFakeService extends ALocation<LocationFakeService> {
	constructor() {
		super(LocationFakeService, 'locationFake');
		this.userService = new UserService();
	}
}

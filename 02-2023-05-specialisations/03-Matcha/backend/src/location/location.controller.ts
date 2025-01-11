import { Body, Get, Param, Put, Request } from '@nestjs/common';
import { Controller } from '$app/app.decorator';
import { LocationFakeService } from './locationFake.service';
import { LocationNavigatorService } from './locationNavigator.service';
import { UseGuards } from '$app/security/security.decorator';
import { IUserLogin } from '$app/user/user.interface';
import { Address, LocationDto } from './location.schema';
import { Api } from './location.decorator';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
	constructor(
		private readonly locationFakeService: LocationFakeService,
		private readonly locationNavigatorService: LocationNavigatorService,
		private readonly locationService: LocationService,
	) {}

	@Api('setFake')
	@UseGuards('profilCompleted')
	@Put('fake')
	async setFake(
		@Request() req: IUserLogin,
		@Body() locationDto: LocationDto,
	): Promise<void> {
		await this.locationFakeService.updateLocationByUser(
			req.user,
			locationDto.latitude,
			locationDto.longitude,
		);
	}

	@Api('setNavigator')
	@UseGuards('profilCompleted')
	@Put('navigator')
	async setNavigator(
		@Request() req: IUserLogin,
		@Body() locationDto: LocationDto,
	): Promise<void> {
		await this.locationNavigatorService.updateLocationByUser(
			req.user,
			locationDto.latitude,
			locationDto.longitude,
		);
	}

	@Api('getAddress')
	@UseGuards('profilCompleted')
	@Get(':latitude/:longitude')
	async getAddress(
		@Param('latitude') latitude: string,
		@Param('longitude') longitude: string,
	): Promise<Address> {
		return await this.locationService.locationToAddress(
			latitude,
			longitude,
		);
	}
}

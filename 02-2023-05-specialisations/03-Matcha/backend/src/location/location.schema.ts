import { ApiProperty } from '@nestjs/swagger';
import { ILocation } from './location.interface';

export class LocationDto {
	@ApiProperty()
	latitude: number;
	@ApiProperty()
	longitude: number;
}

export class Location extends LocationDto implements ILocation {
	@ApiProperty()
	id: number;
	@ApiProperty()
	userId: number;
	@ApiProperty()
	createdAt: Date;
	@ApiProperty()
	updatedAt: Date;
}

class HereAddress {
	@ApiProperty()
	label: string;
	@ApiProperty()
	countryCode: string;
	@ApiProperty()
	countryName: string;
	@ApiProperty()
	state: string;
	@ApiProperty()
	county: string;
	@ApiProperty()
	city: string;
	@ApiProperty()
	district: string;
	@ApiProperty()
	street: string;
	@ApiProperty()
	postalCode: string;
	@ApiProperty()
	houseNumber: string;
}

class HerePosition {
	@ApiProperty()
	lat: number;
	@ApiProperty()
	lng: number;
}

class HereMapView {
	@ApiProperty()
	west: number;
	@ApiProperty()
	south: number;
	@ApiProperty()
	east: number;
	@ApiProperty()
	north: number;
}

export class Address {
	@ApiProperty()
	title: string;
	@ApiProperty()
	id: string;
	@ApiProperty()
	resultType: string;
	@ApiProperty()
	houseNumberType: string;
	@ApiProperty({ type: HereAddress })
	address: HereAddress;
	@ApiProperty({ type: HerePosition })
	position: HerePosition;
	@ApiProperty({ type: [HerePosition] })
	access: HerePosition[];
	@ApiProperty()
	distance: number;
	@ApiProperty({ type: HereMapView })
	mapView: HereMapView;
}

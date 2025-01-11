import { ApiBody } from './api';

export type LocationType = 'IP' | 'FAKE' | 'NAVIGATOR';
export interface CoordinatesDTO extends ApiBody {
	latitude: number;
	longitude: number;
}

export interface HereCoordinatesDTO extends ApiBody {
	lat: number;
	lng: number;
}

export function hereCoordsToCoords(here: HereCoordinatesDTO): CoordinatesDTO {
	return {
		latitude: here.lat,
		longitude: here.lng,
	};
}

export function coordsToHereCoords(here: CoordinatesDTO): HereCoordinatesDTO {
	return {
		lat: here.latitude,
		lng: here.longitude,
	};
}

export interface LeafletCoordinatesDTO extends CoordinatesDTO {
	zoom: number;
	type: LocationType;
}

export interface HereMapViewDTO {
	west: number;
	south: number;
	east: number;
	north: number;
}

export interface IHereAddressDTO {
	label: string;
	countryCode: string;
	countryName: string;
	state: string;
	county: string;
	city: string;
	district: string;
	street: string;
	postalCode: string;
	houseNumber: string;
}
export class HereAddressDTO implements IHereAddressDTO {
	public label: string = '';
	public countryCode: string = '';
	public countryName: string = '';
	public state: string = '';
	public county: string = '';
	public city: string = '';
	public district: string = '';
	public street: string = '';
	public postalCode: string = '';
	public houseNumber: string = '';

	public constructor(datas: Partial<IHereAddressDTO>) {
		Object.entries(datas).forEach(([key, val]) => {
			Object.assign(this, { [key]: val });
		});
	}

	public toString(): string {
		let context = '';
		if (this.city) context += `${this.city}, `;
		if (this.state) context += `${this.state}, `;
		context += this.countryName;
		return context;
	}
}

export interface LocationDTO extends CoordinatesDTO {
	createdAt: Date;
	id: number;
	updatedAt: Date;
	userId: number;
	type: LocationType;
}

export function createLocationDTO(data: Partial<LocationDTO>): LocationDTO {
	return {
		latitude: data.latitude ? data.latitude : 0,
		longitude: data.longitude ? data.longitude : 0,
		createdAt: data.createdAt || new Date(),
		id: data.id || 0,
		updatedAt: data.updatedAt || new Date(),
		userId: data.userId || 0,
		type: data.type || 'IP',
	};
}

export interface LocationsDTO {
	[key: string]: LocationDTO;
	ip: LocationDTO;
	fake: LocationDTO;
	navigator: LocationDTO;
}

export function createLocations(data: Partial<LocationsDTO>): LocationsDTO {
	return {
		ip: createLocationDTO(data.ip ?? {}),
		fake: createLocationDTO(data.fake ?? {}),
		navigator: createLocationDTO(data.navigator ?? {}),
	};
}

export interface LocationAddressDTO {
	title: string;
	id: string;
	distance: number;
	resultType: string;
	houseNumberType: string;
	address: HereAddressDTO;
	position: HereCoordinatesDTO;
	access: HereCoordinatesDTO[];
	mapView: HereMapViewDTO;
}

export type LocationUpdateParams = Pick<HereAddressDTO, 'city' | 'state' | 'countryName'> & LocationDTO;
export class LocationUpdateDTO {
	public openFake: boolean = false;
	public constructor(protected datas: LocationUpdateParams) {}

	public get city(): string {
		return this.datas.city;
	}

	public get context(): string {
		let context = '';
		if (this.datas.city) context += `${this.datas.city}, `;
		if (this.datas.state) context += `${this.datas.state}, `;
		context += this.datas.countryName;
		return context;
	}

	public set context(datas: Pick<HereAddressDTO, 'city' | 'state' | 'countryName'>) {
		this.datas.city = datas.city;
		this.datas.state = datas.state;
		this.datas.countryName = datas.countryName;
	}

	public get latitude(): number {
		return this.datas.latitude;
	}

	public get longitude(): number {
		return this.datas.longitude;
	}

	public get type(): LocationType {
		return this.datas.type;
	}

	public get isFake(): boolean {
		return this.type === 'FAKE';
	}

	public set isFake(value: boolean) {
		if (value) {
			this.datas.type = 'FAKE';
		} else if (!this.isIP && !this.isGPS) {
			this.datas.type = 'IP';
		}
	}

	public get isGPS(): boolean {
		return this.type === 'NAVIGATOR';
	}

	public set isGPS(value: boolean) {
		if (value) {
			this.datas.type = 'NAVIGATOR';
		} else if (!this.isIP && !this.isFake) {
			this.datas.type = 'IP';
		}
	}

	public get isIP(): boolean {
		return this.type === 'IP';
	}

	public set isIP(value: boolean) {
		if (value) {
			this.datas.type = 'IP';
		} else if (!this.isFake && !this.isGPS) {
			this.datas.type = 'IP';
		}
	}

	public get coords(): CoordinatesDTO {
		return { latitude: this.latitude, longitude: this.longitude };
	}

	public get coordsLeaflet(): LeafletCoordinatesDTO {
		return { latitude: this.latitude, longitude: this.longitude, zoom: 13, type: this.type };
	}

	public set update(datas: Partial<LocationUpdateParams>) {
		this.datas = { ...this.datas, ...datas };
	}
}

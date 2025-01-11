import { PicturePreviewConfig } from '@app/components';
import {
	FileDTO,
	ITag,
	Tag,
	LocationsDTO,
	createLocations,
	CoordinatesDTO,
	LocationDTO,
	LocationType,
	LeafletCoordinatesDTO,
	LocationUpdateDTO,
	createLocationDTO,
	OauthStatusDTO,
	CardProfileHistory,
} from '.';

export interface ProfileDTO {
	id: number; //ok
	email: string; //ok
	username: string; //ok
	firstName: string; //ook
	lastName: string; //ok
	locationType: LocationType; //ok
	birthday: string; //ok
	validateEmail: true; //ok
	description: string; //ok
	gender: string; //ok
	sexualPreference: string; //ok
	tags: ITag[]; //ok
	pictures: FileDTO[]; //ok
	defaultPicture: FileDTO; //ok
	locations: LocationsDTO;
	fameRating: number; //ok
	status: string; //ok
	reported: number; //ok
	oauth?: OauthStatusDTO[];
	iReportThisProfile?: boolean;
}

export interface MandatoryProfileDatasDTO {
	[key: string]: boolean;
	defaultPicture: boolean;
	description: boolean;
	gender: boolean;
	sexualPreference: boolean;
	tags: boolean;
	birthday: boolean;
}

export interface IProfileCompletion
	extends Omit<ProfileDTO, 'fameRating' | 'status' | 'reported' | 'id' | 'validateEmail'> {}

export class Profile {
	public id?: number; //ok
	public email?: string; //ok
	public username?: string; //ok
	public firstName?: string; //ook
	public lastName?: string; //ok
	public locationType?: LocationType; //ok
	public birthday?: string; //ok
	public validateEmail?: true; //ok
	public description?: string; //ok
	public gender?: string; //ok
	public sexualPreference?: string; //ok
	public tags?: ITag[]; //ok
	public pictures?: FileDTO[]; //ok
	public defaultPicture?: FileDTO; //ok
	public locations?: LocationsDTO;
	public fameRating?: number; //ok
	public status?: string; //ok
	public reported?: number; //ok
	public oauth?: OauthStatusDTO[];

	public constructor(init?: Partial<Profile>) {
		Object.assign(this, init);
		if (init?.locations) {
			this.locations = createLocations(init.locations);
		}
	}

	public getFullTags(deletable: boolean, updatable: boolean, creatable: boolean): Tag[] {
		return (
			this.tags?.map(
				(tag) => new Tag({ ...tag, canDelete: deletable, canUpdate: updatable, canAdd: creatable }),
			) || []
		);
	}

	public getAge(): number {
		if (!this.birthday) return -1;
		const today = new Date();
		const birthDate = new Date(this.birthday);
		let age = today.getFullYear() - birthDate.getFullYear();
		const month = today.getMonth() - birthDate.getMonth();
		if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}

	public get orderedPictures(): FileDTO[] {
		if (!this.pictures || !this.defaultPicture) return [];

		return [this.defaultPicture, ...this.pictures.filter((picture) => picture.id !== this.defaultPicture?.id)];
	}

	public normalize(): IProfileCompletion {
		return {
			email: this.email || '',
			username: this.username || '',
			firstName: this.firstName || '',
			lastName: this.lastName || '',
			locationType: this.locationType || 'FAKE',
			birthday: this.birthday || '',
			description: this.description || '',
			gender: this.gender || '',
			sexualPreference: this.sexualPreference || '',
			tags: this.tags || [],
			pictures: this.pictures || [],
			defaultPicture: this.defaultPicture || {
				id: -1,
				url: '',
				name: '',
				originalName: '',
				context: 'PROFIL',
				type: 'PICTURE',
				duration: -1,
				width: -1,
				height: -1,
				size: -1,
			},
			locations: this.locations || createLocations({}),
		};
	}

	public get isOnline(): boolean {
		return this.status?.toLocaleLowerCase() === 'online';
	}

	public get completed(): boolean {
		return !!(
			this.gender &&
			this.sexualPreference &&
			this.description &&
			this.pictures &&
			this.pictures.length > 0 &&
			this.defaultPicture &&
			this.birthday &&
			this.birthday.length > 0 &&
			this.tags &&
			this.tags.length > 0 &&
			this.locations &&
			'ip' in this.locations &&
			('navigator' in this.locations || 'fake' in this.locations)
		);
	}

	// TODO: verif que ca bloque pas le carousel de registration
	public static isComplete(profile: ProfileDTO): boolean {
		return !!(
			profile &&
			profile.gender &&
			profile.sexualPreference &&
			profile.description &&
			profile.pictures &&
			profile.pictures.length > 0 &&
			profile.defaultPicture &&
			profile.birthday &&
			profile.birthday.length > 0 &&
			profile.tags &&
			profile.tags.length > 0 &&
			profile.locations &&
			(('ip' in profile.locations && ['navigator', 'fake'].some((key) => key in profile.locations)) ||
				['ip', 'navigator', 'fake'].some((key) => key in profile.locations))
		);
	}

	private prettyCoords(coords: CoordinatesDTO): CoordinatesDTO {
		return {
			longitude: coords.longitude,
			latitude: coords.latitude,
		};
	}

	public get coords(): CoordinatesDTO {
		const locationType = this.locationType?.toLowerCase() || 'ip';
		return this && this.locations && locationType in this.locations && this.locations[locationType]
			? {
					...this.prettyCoords(this.locations[locationType]),
				}
			: this && this.locations && 'ip' in this.locations && this.locations['ip']
				? {
						...this.prettyCoords(this.locations['ip']),
					}
				: { longitude: -1, latitude: -1 };
	}

	public set coords(datas: LocationUpdateDTO) {
		const locationType = datas.type.toLowerCase();
		if (this.locations) {
			this.locations[locationType] = createLocationDTO({
				...this.locations[locationType],
				...this.prettyCoords(datas.coords),
				userId: this.id,
				type: datas.type,
				updatedAt: new Date(),
			});
			this.locationType = datas.type;
		}
	}

	public get location(): LocationDTO | null {
		const locationType = this.locationType?.toLowerCase() || 'ip';
		return this && this.locations && locationType in this.locations && this.locations[locationType]
			? this.locations[locationType]
			: this && this.locations && 'ip' in this.locations && this.locations['ip']
				? this.locations['ip']
				: null;
	}

	public intersectionTags(tags: Tag[]): Tag[] {
		return tags.filter((tag) => this.tags?.some((t) => t.id === tag.id));
	}

	public getCoords(type: LocationType): LeafletCoordinatesDTO {
		const zoom = 13;
		switch (type) {
			case 'IP': {
				const latitude = this.locations?.ip.latitude || 43.71;
				const longitude = this.locations?.ip.longitude || 7.28;
				return { latitude, longitude, zoom, type };
			}
			case 'NAVIGATOR': {
				const latitude = this.locations?.navigator.latitude || 43.71;
				const longitude = this.locations?.navigator.longitude || 7.28;
				return { latitude, longitude, zoom, type };
			}
			case 'FAKE': {
				const latitude = this.locations?.fake.latitude || 43.71;
				const longitude = this.locations?.fake.longitude || 7.28;
				return { latitude, longitude, zoom, type };
			}
		}
	}

	public get pictureProfile(): FileDTO {
		return this.defaultPicture!;
	}

	public get auxPictures(): FileDTO[] {
		return this.pictures!.filter((picture) => picture.id !== this.defaultPicture?.id);
	}

	public get defaultPicturePreview(): PicturePreviewConfig {
		return this.defaultPicture
			? {
					role: 'main',
					url: this.defaultPicture!.url,
					id: this.defaultPicture!.id,
					name: this.defaultPicture!.name,
				}
			: { role: 'main', url: '', id: 0, name: 'placeholder' };
	}

	public get auxPicturesPreview(): PicturePreviewConfig[] {
		const setPlaceholder = (id: number): PicturePreviewConfig => ({
			role: 'aux',
			url: '',
			id,
			name: 'placeholder',
		});

		const aux: PicturePreviewConfig[] = [];
		if (this.pictures && this.defaultPicture) {
			this.pictures.reduce((acc, cur) => {
				if (cur.id !== this.defaultPicture?.id) {
					acc.push({ role: 'aux', url: cur.url, id: cur.id, name: cur.name });
				}
				return acc;
			}, aux);
		}
		while (aux.length < 4) {
			aux.push(setPlaceholder(aux.length + 1));
		}
		return aux;
	}

	public get oauthGoogleDatas(): OauthStatusDTO | undefined {
		return this.oauth?.find((oauth) => oauth.provider === 'Google');
	}

	public get oauthFacebookDatas(): OauthStatusDTO | undefined {
		return this.oauth?.find((oauth) => oauth.provider === 'Facebook');
	}
}

export interface IUsersBlocked {
	results: ProfileDTO[];
	limit: number;
	currentPage: number;
}

export class UsersBlocked {
	private results: ProfileDTO[];
	public limit: number;
	public currentPage: number;

	public constructor(
		init: IUsersBlocked = {
			results: [],
			limit: 0,
			currentPage: 0,
		},
	) {
		this.results = init.results;
		this.limit = init.limit;
		this.currentPage = init.currentPage;
	}

	public get list(): Profile[] {
		return this.results.map((profile) => new Profile(profile));
	}

	public get length(): number {
		return this.results.length;
	}

	public has(id: number): boolean {
		return this.results.some((profile) => profile.id === id);
	}

	public get history(): CardProfileHistory[] {
		return this.results.reduce((acc, cur) => {
			return [...acc, { urlPicture: cur.defaultPicture.url, username: cur.username, userId: cur.id.toString() }];
		}, [] as CardProfileHistory[]);
	}

	public find(id: number): Profile | undefined {
		return this.results.find((profile) => profile.id === id)
			? new Profile(this.results.find((profile) => profile.id === id))
			: undefined;
	}

	private addProfile(profile: ProfileDTO): void {
		this.results.push(profile);
	}

	private removeProfile(profile: ProfileDTO): void {
		this.results = this.results.filter((p) => p.id !== profile.id);
	}

	public add(profiles: ProfileDTO[]): void {
		profiles.forEach((profile) => this.addProfile(profile));
	}

	public remove(id: string): void {
		this.results = this.results.filter((p) => p.id.toString() !== id);
	}

	public unblock(profile: ProfileDTO): void {
		this.removeProfile(profile);
	}
}

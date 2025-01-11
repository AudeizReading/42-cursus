export interface IGoogleOauth {
	access_token: string;
	expires_in: number;
	scope: string;
	token_type: string;
	id_token: string;
}

export interface IGoogleMe {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
}

export interface IFacebookOauth {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export interface IPictureFacebook {
	height: number;
	is_silhouette: boolean;
	url: string;
	width: number;
}

export interface IFacebookMe {
	id: string;
	name: string;
	first_name: string;
	last_name: string;
	picture: {
		data: IPictureFacebook;
	};
	email?: string;
	birthday?: string;
	gender?: 'male' | 'female';
}

export interface IFacebookPhoto {
	height: number;
	source: string;
	width: number;
}

export interface IFacebookPhotoId {
	id: string;
	images: IFacebookPhoto[];
}

export interface IFacebookCursors {
	before?: string;
	after?: string;
}

export interface IFacebookPaging {
	cursors: IFacebookCursors;
	next?: string;
	previous?: string;
}

export interface IFacebookPhotos {
	data: IFacebookPhotoId[];
	paging: IFacebookPaging;
}

export interface IFacebookPermission {
	permission: string;
	status: string;
}

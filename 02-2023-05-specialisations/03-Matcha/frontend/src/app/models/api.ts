import { environment } from '@env/environment';
import {
	ChangePasswordByTokenBodyDTO,
	UpdatePublicProfileAPIQuery,
	UserDescriptionBodyDTO,
	UserGenderBodyDTO,
	UserSexualPrefBodyDTO,
	UserViewQueryDTO,
	UserVisitedQueryDTO,
} from './user';
import { FileDTO } from './file';
import { Profile, ProfileDTO } from './profile';
import { LoginDTO, RegistrationDTO } from './auth';
import { EmailRecoveryBodyDTO } from './email';
import { TagBodyDTO, TagQueryDTO } from './tag';
import { LocationType } from '.';
interface QueryConfig<T extends ApiQuery> {
	required: boolean;
	config?: T;
}

interface BodyConfig<T extends ApiBody | FormData> {
	required: boolean;
	config?: T;
}

export interface RouteConfig {
	method: string;
	requiresAuth: boolean;
	query?: QueryConfig<ApiQuery | UserViewQueryDTO | UserVisitedQueryDTO | TagQueryDTO>;
	body?: BodyConfig<
		| ApiBody
		| RegistrationDTO
		| TagBodyDTO
		| EmailRecoveryBodyDTO
		| LoginDTO
		| UserSexualPrefBodyDTO
		| UserGenderBodyDTO
		| UserDescriptionBodyDTO
		| UserSexualPrefBodyDTO
		| ChangePasswordByTokenBodyDTO
		| FileDTO
		| ProfileDTO
		| FormData
	>;
	params?: boolean;
}

export interface Route {
	[key: string]: string | Route | RouteConfig[];
	uri: string;
	config: RouteConfig[];
}

function buildRoute(uri: string, methods: Partial<RouteConfig>[]): Route {
	const config: RouteConfig[] =
		methods.map((method) => {
			return {
				method: method.method || 'GET',
				requiresAuth: method.requiresAuth || false,
				query: { required: method.query?.required || false, config: method.query?.config },
				body: { required: method.body?.required || false, config: method.body?.config },
				params: method.params || false,
			};
		}) || [];
	return { uri, config };
}

export interface ApiQuery {}
export interface ApiBody {}

export const base: string = `${environment.frontendUrl}/api/`;

export const routes = {
	v1: {
		auth: {
			login: buildRoute('v1/auth/login', [
				{ method: 'POST', body: { required: true, config: { username: '', password: '' } } },
			]),
		},
		oauth: {
			google: buildRoute('v1/oauth/google', [{ method: 'GET', query: { required: true, config: { code: '' } } }]),
			facebook: buildRoute('v1/oauth/facebook', [
				{ method: 'GET', query: { required: true, config: { code: '' } } },
			]),
			endpoint: buildRoute('v1/oauth', [
				{ method: 'GET', query: { required: false, config: { createUser: 'false' } } },
			]),
			link: buildRoute('v1/oauth/link', [
				{ method: 'PUT', body: { required: true, config: { idProvider: '' } }, requiresAuth: true },
			]),
			unlink: buildRoute('v1/oauth/unlink', [
				{ method: 'DELETE', body: { required: true, config: { idProvider: '' } }, requiresAuth: true },
			]),
		},
		registration: buildRoute('v1/registration', [
			{
				method: 'POST',
				body: {
					required: true,
					config: {
						email: '',
						username: '',
						password: '',
						firstName: '',
						lastName: '',
					},
				},
			},
		]),
		user: {
			changePassword: buildRoute('v1/user/changePasswordByToken', [
				{
					method: 'PUT',
					body: {
						required: true,
						config: {
							token: '',
							newPassword: '',
						},
					},
				},
			]),
			defaultPicture: buildRoute('v1/user/defaultPicture/', [
				{ method: 'PUT', params: true, requiresAuth: true },
			]),
			description: buildRoute('v1/user/description', [
				{
					method: 'PUT',
					body: {
						required: true,
						config: {
							description: '',
						},
					},
					requiresAuth: true,
				},
			]),
			gender: buildRoute('v1/user/gender', [
				{
					method: 'PUT',
					body: {
						required: true,
						config: {
							gender: '',
						},
					},
					requiresAuth: true,
				},
			]),
			sexualPreference: buildRoute('v1/user/sexualPreference', [
				{
					method: 'PUT',
					body: {
						required: true,
						config: {
							sexualPreference: '',
						},
					},
					requiresAuth: true,
				},
			]),
			locationType: buildRoute('v1/user/locationType', [
				{
					method: 'PUT',
					body: {
						required: true,
						config: {
							locationType: ('IP' || 'FAKE' || 'NAVIGATOR') as LocationType,
						},
					},
					requiresAuth: true,
				},
			]),
			birthday: buildRoute('v1/user/birthday', [
				{
					method: 'PUT',
					body: {
						required: true,
						config: {
							birthday: 0,
						},
					},
					requiresAuth: true,
				},
			]),
			view: {
				endpoint: buildRoute('v1/user/view/', [
					{
						method: 'GET',
						query: {
							required: true,
							config: {
								limit: 5,
								page: 0,
							},
						},
						requiresAuth: true,
					},
				]),
				id: buildRoute('v1/user/view/', [
					{
						method: 'GET',
						params: true,
						requiresAuth: true,
					},
				]),
			},
			visited: {
				endpoint: buildRoute('v1/user/visited/', [
					{
						method: 'GET',
						query: {
							required: true,
							config: {
								limit: 5,
								page: 0,
							},
						},
						requiresAuth: true,
					},
				]),
				id: buildRoute('v1/user/visited/', [
					{
						method: 'GET',
						params: true,
						requiresAuth: true,
					},
				]),
			},
			like: {
				endpoint: buildRoute('v1/user/like/', [
					{
						method: 'GET',
						query: {
							required: true,
							config: {
								limit: 5,
								page: 0,
							},
						},
						requiresAuth: true,
					},
				]),
				id: buildRoute('v1/user/like/', [
					{
						method: 'GET',
						params: true,
						requiresAuth: true,
					},
				]),
			},
			liked: {
				endpoint: buildRoute('v1/user/liked/', [
					{
						method: 'GET',
						query: {
							required: true,
							config: {
								limit: 5,
								page: 0,
							},
						},
						requiresAuth: true,
					},
				]),
				id: buildRoute('v1/user/liked/', [
					{
						method: 'GET',
						params: true,
						requiresAuth: true,
					},
				]),
			},
			match: {
				endpoint: buildRoute('v1/user/match/', [
					{
						method: 'GET',
						query: {
							required: true,
							config: {
								limit: 5,
								page: 0,
							},
						},
						requiresAuth: true,
					},
				]),
				id: buildRoute('v1/user/matches/', [
					{
						method: 'GET',
						params: true,
						requiresAuth: true,
					},
				]),
			},
			matches: {
				id: buildRoute('v1/user/matches/', [
					{
						method: 'GET',
						params: true,
						requiresAuth: true,
					},
				]),
			},
			stats: buildRoute('v1/user/stats/', [
				{
					method: 'GET',
					requiresAuth: true,
				},
			]),
			endpoint: buildRoute('v1/user', [
				{
					method: 'PUT',
					body: {
						required: true,
						config: {} as Profile | UpdatePublicProfileAPIQuery,
					},
					requiresAuth: true,
				},
			]),
		},
		file: {
			info: buildRoute('v1/file/info/', [{ method: 'GET', params: true }]),
			profile: buildRoute('v1/file/profile', [
				{
					method: 'POST',
					body: {
						required: true,
						config: new FormData(),
					},
					requiresAuth: true,
				},
			]),
			id: buildRoute('v1/file/id/', [{ method: 'DELETE', params: true, requiresAuth: true }]),
			endpoint: buildRoute('v1/file/', [
				{ method: 'GET', params: true },
				{ method: 'DELETE', params: true, requiresAuth: true },
			]),
			chat: {
				picture: buildRoute('v1/file/chat/picture/', [
					{
						method: 'POST',
						body: {
							required: true,
							config: new FormData(),
						},
						requiresAuth: true,
					},
				]),
				video: buildRoute('v1/file/chat/video/', [
					{
						method: 'POST',
						body: {
							required: true,
							config: new FormData(),
						},
						requiresAuth: true,
					},
				]),
				audio: buildRoute('v1/file/chat/audio/', [
					{
						method: 'POST',
						body: {
							required: true,
							config: new FormData(),
						},
						requiresAuth: true,
					},
				]),
			},
			event: buildRoute('v1/file/event/', [
				{
					method: 'POST',
					body: {
						required: true,
						config: new FormData(),
					},
					requiresAuth: true,
				},
			]),
		},
		tag: {
			endpoint: buildRoute('v1/tag', [
				{
					method: 'GET',
					query: {
						required: true,
						config: {
							limit: 5,
							page: 0,
							search: '',
						},
					},
				},
				{
					method: 'POST',
					body: {
						required: true,
						config: {
							tag: '',
						},
					},
					requiresAuth: true,
				},
				{
					method: 'DELETE',
					body: {
						required: true,
						config: {
							tag: '',
						},
					},
					requiresAuth: true,
				},
			]),
		},
		email: {
			validate: buildRoute('v1/email/validate/', [{ params: true }]),
			send: {
				recovery: buildRoute('v1/email/send/recovery', [
					{
						method: 'POST',
						body: {
							required: true,
							config: {
								email: '',
							},
						},
					},
				]),
			},
		},
		token: {
			endpoint: buildRoute('v1/token/', [{ params: true }]),
		},
		profile: {
			endpoint: buildRoute('v1/profile/', [{ requiresAuth: true }]),
			id: {
				endpoint: buildRoute('v1/profile/', [{ params: true, requiresAuth: true }]),
				like: buildRoute('v1/profile/', [{ method: 'PUT', params: true, requiresAuth: true }]),
				dislike: buildRoute('v1/profile/', [{ method: 'PUT', params: true, requiresAuth: true }]),
				unlike: buildRoute('v1/profile/', [{ method: 'PUT', params: true, requiresAuth: true }]),
				report: buildRoute('v1/profile/', [{ method: 'PUT', params: true, requiresAuth: true }]),
				block: buildRoute('v1/profile/', [{ method: 'PUT', params: true, requiresAuth: true }]),
				unblock: buildRoute('v1/profile/', [{ method: 'PUT', params: true, requiresAuth: true }]),
				view: buildRoute('v1/profile/', [{ method: 'PUT', params: true, requiresAuth: true }]),
			},
			me: buildRoute('v1/profile/me/', [{ requiresAuth: true }]),
		},
		block: {
			endpoint: buildRoute('v1/block/', [
				{
					requiresAuth: true,
					query: {
						required: true,
						config: {
							limit: 5,
							page: 0,
						},
					},
				},
			]),
		},
		gender: {
			endpoint: buildRoute('v1/gender', [{ method: 'GET' }]),
		},
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'sexual-preference': {
			endpoint: buildRoute('v1/sexual-preference/', [{ requiresAuth: true }]),
		},
		location: {
			fake: buildRoute('v1/location/fake/', [
				{
					method: 'PUT',
					body: {
						required: true,
						config: {
							latitude: 0,
							longitude: 0,
						},
					},
					requiresAuth: true,
				},
			]),
			navigator: buildRoute('v1/location/navigator/', [
				{
					method: 'PUT',
					body: {
						required: true,
						config: {
							latitude: 0,
							longitude: 0,
						},
					},
					requiresAuth: true,
				},
			]),
			// url expected location/{latitude}/{longitude}
			endpoint: buildRoute('v1/location/', [
				{
					method: 'GET',
					params: true,
					requiresAuth: true,
				},
			]),
		},
		chat: {
			message: {
				send: buildRoute('v1/chat/message/send/', [
					{
						method: 'POST',
						body: {
							required: true,
							config: {
								userId: 0,
								message: '',
							},
						},
						requiresAuth: true,
					},
				]),
				id: buildRoute('v1/chat/message/', [
					{
						method: 'GET',
						params: true, // params -> {userId}
						query: {
							required: true,
							config: {
								limit: 5,
								page: 0,
							},
						},
						requiresAuth: true,
					},
				]),
				read: {
					id: buildRoute('v1/chat/message/read/', [
						{
							method: 'PUT',
							params: true, // params -> {userId
							requiresAuth: true,
						},
					]),
				},
			},
			unread: buildRoute('v1/chat/unread/', [
				{
					method: 'GET',
					requiresAuth: true,
				},
			]),
		},
		notification: {
			id: buildRoute('v1/notification/', [
				{
					method: 'PUT',
					requiresAuth: true,
					params: true,
				},
				{
					method: 'DELETE',
					requiresAuth: true,
					params: true,
				},
			]),
			unread: buildRoute('v1/notification/unread/', [
				{
					method: 'GET',
					requiresAuth: true,
					query: {
						required: true,
						config: {
							limit: 5,
							page: 0,
						},
					},
				},
			]),
			endpoint: buildRoute('v1/notification/', [
				{
					method: 'GET',
					requiresAuth: true,
				},
			]),
		},
		'picture-facebook': {
			right: buildRoute('v1/picture-facebook/right/', [
				{
					method: 'GET',
					requiresAuth: true,
				},
			]),
			id: buildRoute('v1/picture-facebook/', [
				// -> v1/picture-facebook/{id}
				{
					method: 'PUT',
					requiresAuth: true,
					params: true,
				},
			]),
			picture: {
				endpoint: buildRoute('v1/picture-facebook/picture/', [
					{
						method: 'GET',
						requiresAuth: true,
					},
				]),
				before: buildRoute('v1/picture-facebook/picture/before/', [
					{
						method: 'GET',
						requiresAuth: true,
						params: true,
					},
				]),
				after: buildRoute('v1/picture-facebook/picture/after/', [
					{
						method: 'GET',
						requiresAuth: true,
						params: true,
					},
				]),
			},
		},
		event: {
			endpoint: buildRoute('v1/event/', [
				{
					method: 'GET',
					requiresAuth: true,
					query: {
						required: true,
						config: {
							limit: 5,
							page: 0,
						},
					},
				},
				{
					method: 'POST',
					requiresAuth: true,
					body: {
						required: true,
						config: {
							location: {
								latitude: 0,
								longitude: 0,
							},
							matchId: 0,
							datetime: 'string',
							name: 'string',
							description: 'string',
							fileId: 0,
						},
					},
				},
			]),
			id: {
				accept: buildRoute('v1/event/', [
					{
						method: 'PUT',
						requiresAuth: true,
						params: true,
					},
				]),
				refuse: buildRoute('v1/event/', [
					{
						method: 'PUT',
						requiresAuth: true,
						params: true,
					},
				]),
			},
		},
		browsing: {
			search: buildRoute('v1/browsing/search/', [
				{
					method: 'POST',
					requiresAuth: true,
					query: {
						required: true,
						config: {
							howManyUser: 5,
							currentUser: 0,
							orderBy: 'location' as 'location' | 'commonTags' | 'age' | 'fameRating',
							sortBy: 'ASC' as 'ASC' | 'DESC',
						},
					},
					body: {
						required: true,
						config: {
							tagsIds: [0],
							ageRange: { min: 0, max: 0 },
							distanceRange: { min: 0, max: 0 },
						},
					},
				},
			]),
			endpoint: buildRoute('v1/browsing/', [
				{
					method: 'GET',
					requiresAuth: true,
					query: {
						required: true,
						config: {
							howManyUser: 5,
							currentUser: 0,
							orderBy: 'location' as 'location' | 'commonTags' | 'age' | 'fameRating',
							sortBy: 'ASC' as 'ASC' | 'DESC',
							locationMin: 0,
							locationMax: 0,
							commonTagMin: 0,
							commonTagMax: 0,
							fameRatingMin: 0,
							fameRatingMax: 0,
							ageMin: 0,
							ageMax: 0,
						},
					},
				},
			]),
		},
	},
	v2: {
		chat: {
			message: {
				id: buildRoute('v2/chat/message/', [
					{
						method: 'GET',
						params: true, // params -> {userId}
						query: {
							required: true,
							config: {
								limit: 5,
								maxId: 0,
							},
						},
						requiresAuth: true,
					},
				]),
			},
		},
		notification: {
			endpoint: buildRoute('v2/notification/', [
				{
					method: 'GET',
					requiresAuth: true,
					query: {
						required: true,
						config: {
							limit: 5,
							maxId: 0,
						},
					},
				},
			]),
		},
	},
} as const;

type Routes = typeof routes;
function setApiRoutes(base: string, routes: Routes): Routes {
	const api: Routes = {} as Routes;
	for (const key in routes) {
		if (Object.prototype.hasOwnProperty.call(routes, key)) {
			const element = Object.getOwnPropertyDescriptor(routes, key)?.value;
			if (typeof element === 'object' && 'uri' in (element as Route) && 'config' in (element as Route)) {
				const { uri, config } = element as Route;

				const route = {
					uri: base + uri,
					config: [...config],
				};
				Object.defineProperty(api, key, { value: route, enumerable: true });
			} else if (typeof element === 'object') {
				Object.defineProperty(api, key, { value: setApiRoutes(base, element), enumerable: true });
			}
		}
	}
	return api;
}

const api = setApiRoutes(base, routes);
export { api };

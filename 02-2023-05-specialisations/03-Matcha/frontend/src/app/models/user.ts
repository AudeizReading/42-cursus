import { ApiBody, ApiQuery } from './api';
import { IUsersBlocked, Profile, ProfileDTO, UsersBlocked } from './profile';
// type
export interface ChangePasswordByTokenBodyDTO extends ApiBody {
	token: string;
	newPassword: string;
}
export interface UserDescriptionBodyDTO extends ApiBody {
	description: string;
}
export interface UserGenderBodyDTO extends ApiBody {
	gender: string;
}
export interface UserSexualPrefBodyDTO extends ApiBody {
	sexualPreference: string;
}
export interface UserLocationTypeDTO extends ApiBody {
	locationType: string;
}

export interface UserBirthdayDTO extends ApiBody {
	birthday: number;
}

export interface LimitPageQueryDTO extends ApiQuery {
	limit: number;
	page: number;
}

export interface UserHasInteractedResponseDTO {
	status: boolean;
}

export interface UserViewQueryDTO extends LimitPageQueryDTO {}
export interface UserVisitedQueryDTO extends LimitPageQueryDTO {}
export interface UserLikeQueryDTO extends LimitPageQueryDTO {}
export interface UserLikedQueryDTO extends LimitPageQueryDTO {}
export interface UserMatchQueryDTO extends LimitPageQueryDTO {}

export interface CountResponseDTO {
	[key: string]: number | ProfileDTO;
	count: number;
	user: ProfileDTO;
}

export interface UserResponseDTO {
	[key: string]: ProfileDTO;
	user: ProfileDTO;
}

export interface UpdatePublicProfileAPIQuery {
	username?: string;
	firstname?: string;
	lastname?: string;
	birthday?: number;
	description?: string;
	gender?: string;
	sexualPreference?: string;
}

export interface UpdatePrivateProfileAPIQuery {
	email?: string;
	password?: string;
}

export interface UserLikeResponseDTO extends ProfileDTO {}

export interface UserStatsResponseDTO {
	[key: string]: number;
	likeMe: number;
	like: number;
	viewMe: number;
	view: number;
	matches: number;
	blocked: number;
}

export interface UserViewsDTO extends CountResponseDTO {}
export interface UserVisitsDTO extends CountResponseDTO {}
export interface UserLikesDTO extends UserLikeResponseDTO {}
export interface UserLikedDTO extends UserLikeResponseDTO {}
export interface UserBlockedDTO extends UserLikeResponseDTO {}
export interface UserMatchesDTO extends UserResponseDTO {}

export abstract class ADataHistory<T extends UserResponseDTO | CountResponseDTO> {
	public constructor(protected datas: T[]) {}

	public get all(): T[] {
		return this.datas;
	}

	// Nb de totals de personnes distinctes ayant interagi
	public get length(): number {
		return this.datas.length;
	}

	public has(data: T): boolean {
		return this.datas.includes(data);
	}

	// prop = user | count
	public getUserByProp(prop: string, value: number | ProfileDTO): ProfileDTO | undefined {
		return this.datas.find((data) => data[prop] === value)?.user;
	}

	// prop = user | count
	public hasDataByProp(prop: string, value: number | ProfileDTO): boolean {
		return this.datas.some((data) => data[prop] === value);
	}

	// prop = user | count
	public getDataByProp(prop: string, value: number | ProfileDTO): T | undefined {
		return this.datas.find((data) => data[prop] === value);
	}

	// Recupere user + count par id (si count existe, sinon que user)
	public getDataUserById(value: number): T | undefined {
		return this.datas.find((data) => data.user.id === value);
	}

	// Recupere un utilisateur avec lequel une interaction a eu lieu
	public getUserById(id: number): ProfileDTO | undefined {
		return this.datas.find((data) => data.user.id === id || data['id'] === id)?.user;
	}

	// Check si un utilisateur a interagi
	public hasUserById(id: number): boolean {
		return this.datas?.some((data) => data.user?.id === id || data['id'] === id);
	}
}

export abstract class ADataHistoryLike<T extends UserLikeResponseDTO> {
	public constructor(protected datas: T[]) {}

	public get all(): T[] {
		return this.datas;
	}

	// Nb de totals de personnes distinctes ayant interagi
	public get length(): number {
		return this.datas.length;
	}

	public has(id: number): boolean {
		return this.datas.some((data: UserLikeResponseDTO) => data.id === id);
	}

	// Recupere un utilisateur avec lequel une interaction a eu lieu
	public getUserById(id: number): ProfileDTO | undefined {
		return this.datas.find((data) => data.id === id || data['id'] === id);
	}
}

export abstract class ADataWithCountHistory<T extends CountResponseDTO> extends ADataHistory<T> {
	public constructor(datas: T[]) {
		super(datas);
	}

	// Nb total d'interactions
	public get count(): number {
		return this.datas.reduce((acc, data) => acc + data.count, 0);
	}

	// Nb total d'interactions par utilisateur, par profile
	public countByUser(user: ProfileDTO): number {
		const data = this.getDataByProp('user', user);
		return data ? data.count : 0;
	}

	// Nb total d'interactions par utilisateur, par id
	public countByUserId(id: number): number {
		const data = this.getDataUserById(id);
		return data ? data.count : 0;
	}
}

export class UserViewsHistory extends ADataWithCountHistory<UserViewsDTO> {
	public constructor(datas: UserViewsDTO[]) {
		super(datas);
	}
}
export class UserVisitsHistory extends ADataWithCountHistory<UserVisitsDTO> {
	public constructor(datas: UserVisitsDTO[]) {
		super(datas);
	}
}
export class UserLikesHistory extends ADataHistoryLike<UserLikesDTO> {
	public constructor(datas: UserLikesDTO[]) {
		super(datas);
	}
}
export class UserLikedHistory extends ADataHistoryLike<UserLikedDTO> {
	public constructor(datas: UserLikedDTO[]) {
		super(datas);
	}
}

export class UsersBlockedHistory extends ADataHistoryLike<UserBlockedDTO> {
	public constructor(datas: UserBlockedDTO[]) {
		super(datas);
	}
}

export class UserMatchesHistory extends ADataHistory<UserMatchesDTO> {
	public constructor(datas: UserMatchesDTO[]) {
		super(datas);
	}
}

export class UserStatsHistory {
	public constructor(public datas: UserStatsResponseDTO) {}
	public toString(): string {
		return `UserStatsHistory - stats : {
			likeMe: ${this.datas.likeMe},
			like: ${this.datas.like},
			viewMe: ${this.datas.viewMe},
			view: ${this.datas.view},
			matches: ${this.datas.matches},
			block: ${this.datas.blocked},
		}`;
	}
}

export class UserHistory {
	public pages = {
		views: 0,
		visited: 0,
		likes: 0,
		liked: 0,
		matches: 0,
		blocked: 0,
	};
	public constructor(
		public stats: UserStatsHistory,
		public views: UserViewsHistory,
		public visited: UserVisitsHistory,
		public likes: UserLikesHistory,
		public liked: UserLikedHistory,
		public matches: UserMatchesHistory,
		public blocked: UsersBlocked,
		public limit = 5,
	) {
		this.pages = {
			views: this.pageCalculator(this.stats.datas.viewMe, this.views.count, this.limit),
			visited: this.pageCalculator(this.stats.datas.view, this.visited.length, this.limit),
			likes: this.pageCalculator(this.stats.datas.likeMe, this.likes.length, this.limit),
			liked: this.pageCalculator(this.stats.datas.like, this.liked.length, this.limit),
			matches: this.pageCalculator(this.stats.datas.matches, this.matches.length, this.limit),
			blocked: this.pageCalculator(this.stats.datas.blocked, this.blocked.length, this.limit),
		};
	}

	private pageCalculator(pending: number, fetched: number, limit: number): number {
		return fetched === pending ? -1 : fetched % limit > 0 ? -1 : Math.ceil(fetched / limit);
	}

	// views
	public hasBeenViewedByUser(id: number): boolean {
		return this.views.hasUserById(id);
	}

	public get viewers(): ProfileDTO[] {
		return this.views.all.map((data) => data.user);
	}

	public getViewsBy(id: number): number {
		return this.views.all.find((data) => data.user.id === id)?.count || 0;
	}

	public getViewerById(id: number): ProfileDTO | undefined {
		return this.views.getUserById(id);
	}

	public get totalViews(): number {
		return this.stats.datas.viewMe;
	}

	public get totalViewers(): number {
		return this.views.length;
	}

	public addViewers(viewers: UserViewsDTO[]): void {
		this.views.all.push(...viewers);
		this.pages.views =
			this.stats.datas.viewMe === this.views.count
				? -1
				: this.pageCalculator(this.stats.datas.viewMe, this.views.length, this.limit);
	}

	// visited
	public hasVisitedUser(id: number): boolean {
		return this.visited.hasUserById(id);
	}

	public get visits(): ProfileDTO[] {
		return this.visited.all.map((data) => data.user);
	}

	public getVisitsBy(id: number): number {
		return this.visited.all.find((data) => data.user.id === id)?.count || 0;
	}

	public getVisitsById(id: number): ProfileDTO | undefined {
		return this.visited.getUserById(id);
	}

	public get totalAccumulatedVisits(): number {
		return this.visited.count;
	}

	public get totalVisits(): number {
		return this.stats.datas.view;
	}

	public addVisited(visits: UserVisitsDTO[]): void {
		this.visited.all.push(...visits);
		this.pages.visited =
			this.stats.datas.view === this.visited.count
				? -1
				: this.pageCalculator(this.stats.datas.view, this.visited.length, this.limit);
	}

	// likes
	public hasBeenLikedByUser(id: number): boolean {
		return this.likes.has(id);
	}

	public get likers(): UserLikesDTO[] {
		return this.likes.all;
	}

	public getLikerById(id: number): ProfileDTO | undefined {
		return this.likes.getUserById(id);
	}

	public get totalLikes(): number {
		return this.stats.datas.likeMe;
	}

	public addLikes(likes: UserLikesDTO[]): void {
		this.likes.all.push(...likes);
		this.pages.likes = this.pageCalculator(this.stats.datas.likeMe, this.likes.length, this.limit);
	}

	// liked
	public hasLikedUser(id: number): boolean {
		return this.liked.has(id);
	}

	public get likees(): UserLikedDTO[] {
		return this.liked.all;
	}

	public getLikeeById(id: number): ProfileDTO | undefined {
		return this.liked.getUserById(id);
	}

	public get totalLikees(): number {
		return this.stats.datas.like;
	}

	public addLikee(likee: UserLikedDTO[]): void {
		this.liked.all.push(...likee);
		this.pages.liked = this.pageCalculator(this.stats.datas.like, this.liked.length, this.limit);
	}

	// blocked
	public hasBlockedUser(id: number): boolean {
		return this.blocked.has(id);
	}

	public get blockees(): Profile[] {
		return this.blocked.list;
	}

	public getBlockedById(id: number): Profile | undefined {
		return this.blocked.find(id);
	}

	public get totalBlocked(): number {
		return this.stats.datas.blocked;
	}

	public addBlocked(blocked: IUsersBlocked): void {
		this.blocked.add(blocked.results);
		this.blocked.limit = blocked.limit;
		this.blocked.currentPage = blocked.currentPage;
		this.pages.blocked = this.pageCalculator(this.stats.datas.blocked, this.blocked.length, this.limit);
	}

	public removeBlocked(id: string): void {
		this.blocked.remove(id);
		this.stats.datas.blocked--;
	}

	// matches
	public hasMatchedUser(id: number): boolean {
		return this.matches.hasUserById(id);
	}

	public get matchers(): ProfileDTO[] {
		return this.matches.all as unknown as ProfileDTO[];
	}

	public getMatchById(id: number): ProfileDTO | undefined {
		return this.matches.getUserById(id);
	}

	public get totalMatches(): number {
		return this.matches.length;
	}

	public addMatches(matches: UserMatchesDTO[]): void {
		this.matches.all.push(...matches);
		this.pages.matches = this.pageCalculator(this.stats.datas.matches, this.matches.length, this.limit);
	}

	public toString(): string {
		return `UserHistory - global stats : {
		stats: ${this.stats.datas},
	}`;
	}

	public clone(): UserHistory {
		return new UserHistory(
			new UserStatsHistory({ ...this.stats.datas }),
			new UserViewsHistory([...this.views.all]),
			new UserVisitsHistory([...this.visited.all]),
			new UserLikesHistory([...this.likes.all]),
			new UserLikedHistory([...this.liked.all]),
			new UserMatchesHistory([...this.matches.all]),
			new UsersBlocked({
				results: [...this.blocked.list] as ProfileDTO[],
				limit: this.blocked.limit,
				currentPage: this.pages.blocked,
			}),
			this.limit,
		);
	}
}

export class UserHistoryCard extends UserHistory {
	public constructor(history: UserHistory) {
		super(
			history.stats,
			history.views,
			history.visited,
			history.likes,
			history.liked,
			history.matches,
			history.blocked,
		);
	}

	private usersCards(users: ProfileDTO[], type?: string): CardProfileHistory[] {
		return users.reduce((acc, cur) => {
			const cardProfileHistory: CardProfileHistory = {
				username: cur.username,
				userId: cur.id.toString(),
				urlPicture: cur.defaultPicture.url,
			};
			if (type === 'views') {
				cardProfileHistory.count = this.getViewsBy(cur.id);
			} else if (type === 'visits') {
				cardProfileHistory.count = this.getVisitsBy(cur.id);
			}
			return [...acc, cardProfileHistory];
		}, [] as CardProfileHistory[]);
	}

	public get viewersCards(): CardProfileHistory[] {
		return this.usersCards(this.viewers, 'views');
	}

	public get visitsCards(): CardProfileHistory[] {
		return this.usersCards(this.visits, 'visits');
	}

	public get likeesCards(): CardProfileHistory[] {
		return this.usersCards(this.likees, 'likees');
	}

	public get likersCards(): CardProfileHistory[] {
		return this.usersCards(this.likers, 'likers');
	}

	public get matchersCards(): CardProfileHistory[] {
		return this.usersCards(this.matchers, 'matchers');
	}

	public get blockedCards(): CardProfileHistory[] {
		return this.usersCards(this.blockees as ProfileDTO[], 'blockees');
	}
}

export interface CardProfileHistory {
	urlPicture: string;
	username: string;
	userId: string;
	count?: number;
}

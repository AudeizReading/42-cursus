import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import {
	CardProfileHistory,
	UserHistory,
	UserLikedHistory,
	UserLikesHistory,
	UserMatchesHistory,
	UsersBlocked,
	// UsersBlockedHistory,
	UserStatsHistory,
	UserViewsHistory,
	UserVisitsHistory,
} from '@app/models';
import { BlockService, UserService } from '@app/shared';

@Injectable({
	providedIn: 'root',
})
export class UserHistoryService {
	public constructor(
		private userService: UserService,
		private blockService: BlockService,
	) {}

	protected fetchAllHistory<T>(
		fetch: (limit: number, page: number) => Observable<T>,
		limit: number = 5,
		page: number = 0,
	): Observable<T> {
		return fetch(limit, page);
	}

	public getLastHistory(limit: number = 5, page: number = 0): Observable<UserHistory> {
		try {
			return forkJoin([
				this.userService.getStats(),
				this.fetchAllHistory(this.userService.getView.bind(this.userService), limit, page),
				this.fetchAllHistory(this.userService.getVisited.bind(this.userService), limit, page),
				this.fetchAllHistory(this.userService.getLike.bind(this.userService), limit, page),
				this.fetchAllHistory(this.userService.getLiked.bind(this.userService), limit, page),
				this.fetchAllHistory(this.userService.getMatch.bind(this.userService), limit, page),
				this.fetchAllHistory(this.blockService.getBlocked.bind(this.blockService), limit, page),
			]).pipe(
				map(([stats, views, visited, likes, liked, matches, blocked]) => {
					return new UserHistory(
						new UserStatsHistory(stats),
						new UserViewsHistory(views),
						new UserVisitsHistory(visited),
						new UserLikesHistory(likes),
						new UserLikedHistory(liked),
						new UserMatchesHistory(matches),
						new UsersBlocked(blocked),
						limit,
					);
				}),
			);
		} catch (error) {
			return of(error) as unknown as Observable<UserHistory>;
		}
	}

	public fetchFollowingHistory(userHistory: UserHistory, limit: number, page: number): Observable<UserHistory> {
		try {
			return forkJoin([
				this.fetchAllHistory(this.userService.getView.bind(this.userService), limit, page),
				this.fetchAllHistory(this.userService.getVisited.bind(this.userService), limit, page),
				this.fetchAllHistory(this.userService.getLike.bind(this.userService), limit, page),
				this.fetchAllHistory(this.userService.getLiked.bind(this.userService), limit, page),
				this.fetchAllHistory(this.userService.getMatch.bind(this.userService), limit, page),
			]).pipe(
				map(([views, visited, likes, liked, matches]) => {
					if (views.length > 0) userHistory.addViewers(views);
					if (visited.length > 0) userHistory.addVisited(visited);
					if (likes.length > 0) userHistory.addLikes(likes);
					if (liked.length > 0) userHistory.addLikee(liked);
					if (matches.length > 0) userHistory.addMatches(matches);
					return userHistory;
				}),
			);
		} catch (error) {
			return of(error) as unknown as Observable<UserHistory>;
		}
	}

	public fetchFollowingViews(userHistory: UserHistory, limit: number, page: number): Observable<UserHistory> {
		try {
			return this.userService.getView(limit, page).pipe(
				map((views) => {
					if (views.length > 0) userHistory.addViewers(views);
					return userHistory;
				}),
			);
		} catch (error) {
			return of(error) as unknown as Observable<UserHistory>;
		}
	}

	public fetchFollowingVisited(userHistory: UserHistory, limit: number, page: number): Observable<UserHistory> {
		try {
			return this.userService.getVisited(limit, page).pipe(
				map((visited) => {
					if (visited.length > 0) if (visited.length > 0) userHistory.addVisited(visited);
					return userHistory;
				}),
			);
		} catch (error) {
			return of(error) as unknown as Observable<UserHistory>;
		}
	}

	public fetchFollowingLikes(userHistory: UserHistory, limit: number, page: number): Observable<UserHistory> {
		try {
			return this.userService.getLike(limit, page).pipe(
				map((likes) => {
					if (likes.length > 0) userHistory.addLikes(likes);
					return userHistory;
				}),
			);
		} catch (error) {
			return of(error) as unknown as Observable<UserHistory>;
		}
	}

	public fetchFollowingLiked(userHistory: UserHistory, limit: number, page: number): Observable<UserHistory> {
		try {
			return this.userService.getLiked(limit, page).pipe(
				map((liked) => {
					if (liked.length > 0) userHistory.addLikee(liked);
					return userHistory;
				}),
			);
		} catch (error) {
			return of(error) as unknown as Observable<UserHistory>;
		}
	}

	public fetchFollowingMatches(userHistory: UserHistory, limit: number, page: number): Observable<UserHistory> {
		try {
			return this.userService.getMatch(limit, page).pipe(
				map((matches) => {
					if (matches.length > 0) userHistory.addMatches(matches);
					return userHistory;
				}),
			);
		} catch (error) {
			return of(error) as unknown as Observable<UserHistory>;
		}
	}

	public fetchBlocked(total: number): Observable<CardProfileHistory[]> {
		try {
			return this.blockService.getBlocked(total, 0).pipe(
				map((blocked) => {
					return blocked?.results.length > 0 ? new UsersBlocked(blocked).history : [];
				}),
			);
		} catch (error) {
			return of(error) as unknown as Observable<CardProfileHistory[]>;
		}
	}

	public fetchFollowingBlocked(userHistory: UserHistory, limit: number, page: number): Observable<UserHistory> {
		try {
			return this.blockService.getBlocked(limit, page).pipe(
				map((blocked) => {
					if (blocked.results.length > 0) userHistory.addBlocked(blocked);
					return userHistory;
				}),
			);
		} catch (error) {
			return of(error) as unknown as Observable<UserHistory>;
		}
	}
}

import { ADatabaseRelationUser } from '$app/database/ADatabaseRelationUser';
import {
	ConflictException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { IDatabaseView, IView } from './view.interface';
import { UserService } from '$app/user/user.service';
import { ADatabase } from '$app/database/ADatabase';
import { UserPublic } from '$app/user/user.interface';

@Injectable()
export class ViewService extends ADatabaseRelationUser<
	IDatabaseView,
	ViewService,
	IView
> {
	private viewId: number;

	constructor() {
		super(ViewService, 'view');
		this.userService = new UserService();
	}

	deserialize(db: IDatabaseView): void {
		this.id = db.id;
		this.userId = db.userId;
		this.viewId = db.viewId;
	}

	normalize(): IView {
		const { id, userId, viewId } = this;
		return {
			id,
			userId,
			viewId,
		};
	}

	async setViewId(userId: number): Promise<void> {
		const userService = this.userService.newInstance();
		const user = await userService.getByPK(userId);
		if (!(await user.isComplete())) {
			throw new ForbiddenException('This profil is complete');
		}
		if (typeof userId != 'number' || userId <= 0)
			throw new Error(`'${userId}' is not valid UserID`);
		if (userId == this.getUserId()) {
			throw new ConflictException('View your profil is not possible');
		}
		this.viewId = userId;
	}

	getViewId(): number {
		return this.viewId;
	}

	async setView(user: UserService): Promise<void> {
		await this.setViewId(user.getId());
	}

	async getView(): Promise<UserService> {
		return await this.userService.getByPK(this.getViewId());
	}

	async getProfilesIVisited(
		limit: number,
		page: number,
	): Promise<{ user: UserPublic; count: number }[]> {
		const userService = new UserService();
		const values = await this.getViewUser('userId', limit, page);
		const users: { user: UserPublic; count: number }[] = [];
		for await (const value of values) {
			const user = await userService.getByPK(value.viewId);
			users.push({ user: await user.getPublic(), count: value.count });
		}
		return users;
	}

	async getProfilesThatVisitedMe(
		limit: number,
		page: number,
	): Promise<{ user: UserPublic; count: number }[]> {
		const userService = new UserService();
		const values = await this.getViewUser('viewId', limit, page);
		const users: { user: UserPublic; count: number }[] = [];
		for await (const value of values) {
			const user = await userService.getByPK(value.userId);
			users.push({ user: await user.getPublic(), count: value.count });
		}
		return users;
	}

	private async getViewUser(
		column: 'userId' | 'viewId',
		limit: number,
		page: number,
	): Promise<(IView & { count: number })[]> {
		const offset = page * limit;
		const sql = `SELECT id, userId, viewId, COUNT(id) as count \
		FROM view \
		WHERE ${column} = ${this.getUserId()} \
		GROUP BY userId, viewId \
		ORDER BY id ASC
		LIMIT ${limit} \
		OFFSET ${offset};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((res) => {
				return res as (IView & { count: number })[];
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}

	async countView(user: UserService): Promise<number> {
		const sql = `SELECT COUNT(*) FROM view WHERE viewId = ${user.getId()};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((res) => {
				return res[0]['COUNT(*)'];
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}

	async countViewed(user: UserService): Promise<number> {
		const sql = `SELECT COUNT(*) FROM view WHERE userId = ${user.getId()};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((res) => {
				return res[0]['COUNT(*)'];
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}

	async isView(userId: number): Promise<boolean> {
		const sql = `SELECT * FROM view WHERE userId = ${this.userId} AND viewId = ${userId};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((res) => {
				return (res as IView[]).length > 0;
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}
}

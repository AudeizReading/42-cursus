import { ADatabaseRelationUser } from '$app/database/ADatabaseRelationUser';
import {
	ConflictException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { IDatabaseLike, ILike } from './like.interface';
import { UserService } from '$app/user/user.service';
import { ADatabase } from '$app/database/ADatabase';
import { IUser, UserPublic } from '$app/user/user.interface';
import { NotificationEventService } from '$app/notification/notification-event.service';

@Injectable()
export class LikeService extends ADatabaseRelationUser<
	IDatabaseLike,
	LikeService,
	ILike
> {
	private likeId: number;

	constructor() {
		super(LikeService, 'like');
		this.userService = new UserService();
	}

	deserialize(db: IDatabaseLike): void {
		this.id = db.id;
		this.userId = db.userId;
		this.likeId = db.likeId;
	}

	normalize(): ILike {
		const { id, userId, likeId } = this;
		return {
			id,
			userId,
			likeId,
		};
	}

	public async profilIsLiked(userId: number): Promise<boolean> {
		const sql = `SELECT * FROM like \
		WHERE userId = ${this.getUserId()} AND likeId = ${userId};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((value: Array<ILike>) => {
				return value.length > 0;
			})
			.catch((err) => {
				throw new Error(err);
			});
	}

	async unlike(userId: number, likeId: number): Promise<void> {
		const sql = `DELETE FROM like \
		WHERE userId = ${userId} AND likeId = ${likeId};`;
		await new NotificationEventService().eventUnlike(
			this.newInstance(),
			userId,
			likeId,
		);
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		await result;
	}

	async setLikeId(userId: number): Promise<void> {
		const userService = this.userService.newInstance();
		const user = await userService.getByPK(userId);
		if (!(await user.isComplete())) {
			throw new ForbiddenException('This profil is not complete');
		}
		if (typeof userId != 'number' || userId <= 0)
			throw new Error(`'${userId}' is not valid UserID`);
		if (userId == this.getUserId()) {
			throw new ConflictException('Like your profil is not possible');
		}
		if (await this.profilIsLiked(userId)) {
			throw new ConflictException('You have already liked this profile');
		}
		this.likeId = userId;
	}

	getLikeId(): number {
		return this.likeId;
	}

	async setLike(user: UserService): Promise<void> {
		await this.setLikeId(user.getId());
	}

	async getLike(limit: number, page: number): Promise<UserPublic[]> {
		const userService = new UserService();
		const values = await this.getLikeUser('likeId', limit, page);
		const users: UserPublic[] = [];
		for await (const value of values) {
			const user = await userService.getByPK(value.userId);
			users.push(await user.getPublic());
		}
		return users;
	}

	async getLiked(limit: number, page: number): Promise<UserPublic[]> {
		const userService = new UserService();
		const values = await this.getLikeUser('userId', limit, page);
		const users: UserPublic[] = [];
		for await (const value of values) {
			const user = await userService.getByPK(value.likeId);
			users.push(await user.getPublic());
		}
		return users;
	}

	private async getLikeUser(
		column: 'userId' | 'likeId',
		limit: number,
		page: number,
	): Promise<ILike[]> {
		const offset = page * limit;
		const sql = `SELECT * FROM like \
		WHERE ${column} = ${this.getUserId()} \
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
				return res as ILike[];
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}

	async isMatch(user: UserService): Promise<boolean> {
		const sql0 = `SELECT * FROM like
			WHERE userId = ${this.getUserId()} AND likeId = ${user.getId()}`;
		const sql1 = `SELECT * FROM like
			WHERE userId = ${user.getId()} AND likeId = ${this.getUserId()}`;
		const values = [];
		const result0 = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql0, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		}).then((v: ILike[]) => {
			if (v.length != 0) values.push(v);
		});
		const result1 = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql1, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		}).then((v: ILike[]) => {
			if (v.length != 0) values.push(v);
		});
		const results = [result0, result1];
		await Promise.all(results);
		return values.length == 2;
	}

	async getMatch(limit: number, page: number): Promise<UserPublic[]> {
		const userService = new UserService();
		const offset = page * limit;
		const currentUser = this.getUserId();
		const sql = `SELECT DISTINCT u.*
			FROM "like" l1 
			INNER JOIN "like" l2 ON (
			l1.userId = l2.likeId 
			AND l1.likeId = l2.userId
			)
			INNER JOIN user u ON l2.likeId = u.id
			LEFT JOIN block b ON (
			(l2.likeId = b.blockId AND b.userId = ${currentUser})
			OR (l2.likeId = b.userId AND b.blockId = ${currentUser})
			)
			WHERE l1.likeId == ${currentUser}
			AND b.id IS NULL
			LIMIT ${limit} OFFSET ${offset};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then(async (res) => {
				const values = res as IUser[];
				const users: UserPublic[] = [];
				for await (const value of values) {
					const user = await userService.getByPK(value.id);
					users.push(await user.getPublic());
				}
				return users;
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}

	async getMatchCount(user: UserService): Promise<number> {
		const sql = `SELECT COUNT(DISTINCT u.id)
			FROM "like" l1 
			INNER JOIN "like" l2 ON (
			l1.userId = l2.likeId 
			AND l1.likeId = l2.userId
			)
			INNER JOIN user u ON l2.likeId = u.id
			LEFT JOIN block b ON (
			(l2.likeId = b.blockId AND b.userId = ${user.getId()})
			OR (l2.likeId = b.userId AND b.blockId = ${user.getId()})
			)
			WHERE l1.likeId == ${user.getId()}
			AND b.id IS NULL;`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((res) => {
				return res[0]['COUNT(DISTINCT u.id)'];
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}

	async countLike(user: UserService): Promise<number> {
		const sql = `SELECT COUNT(*) FROM like WHERE likeId = ${user.getId()};`;
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

	async countLiked(user: UserService): Promise<number> {
		const sql = `SELECT COUNT(*) FROM like WHERE userId = ${user.getId()};`;
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
}

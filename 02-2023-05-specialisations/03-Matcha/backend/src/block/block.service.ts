import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { IBlock, IDatabaseBlock } from './block.interface';
import { ADatabaseRelationUser } from '$app/database/ADatabaseRelationUser';
import { UserService } from '$app/user/user.service';
import { ADatabase } from '$app/database/ADatabase';
import { OkResponseGetBlock, QueryBlock } from './block.scheme';
import { UserPublic } from '$app/user/user.interface';

@Injectable()
export class BlockService extends ADatabaseRelationUser<
	IDatabaseBlock,
	BlockService,
	IBlock
> {
	private blockId: number;

	constructor() {
		super(BlockService, 'block');
		this.userService = new UserService();
	}

	deserialize(db: IDatabaseBlock): void {
		this.id = db.id;
		this.userId = db.userId;
		this.blockId = db.blockId;
	}

	normalize(): IBlock {
		const { id, userId, blockId } = this;
		return {
			id,
			userId,
			blockId,
		};
	}

	private async profilIsBlocked(userId: number): Promise<boolean> {
		const sql = `SELECT * FROM block \
		WHERE userId = ${this.getUserId()} AND blockId = ${userId};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((value: Array<IBlock>) => {
				return value.length > 0;
			})
			.catch((err) => {
				throw new Error(err);
			});
	}

	async isBlocked(user: UserService): Promise<boolean> {
		return await this.profilIsBlocked(user.getId());
	}

	async isBlockedById(userId: number): Promise<boolean> {
		return await this.profilIsBlocked(userId);
	}

	async setBlockId(userId: number): Promise<void> {
		const userService = this.userService.newInstance();
		const user = await userService.getByPK(userId);
		if (!(await user.isComplete())) {
			throw new ForbiddenException('This profile is not complete');
		}
		if (typeof userId != 'number' || userId <= 0)
			throw new Error(`'${userId}' is not valid UserID`);
		if (userId == this.getUserId()) {
			throw new ConflictException('Block your profile is not possible');
		}
		if (await this.profilIsBlocked(userId)) {
			throw new ConflictException(
				'You have already blocked this profile',
			);
		}
		this.blockId = userId;
	}

	getBlockId(): number {
		return this.blockId;
	}

	async setBlock(user: UserService): Promise<void> {
		await this.setBlockId(user.getId());
	}

	private async getBlockedUser(
		user: UserService,
		search: QueryBlock,
	): Promise<UserPublic[]> {
		const offset = search.page * search.limit;
		const sql = `SELECT * FROM block WHERE userId = ${user.getId()} \
		LIMIT ${search.limit} OFFSET ${offset};`;
		const result = new Promise<IDatabaseBlock[]>((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows as IDatabaseBlock[]);
			});
		});
		const values: UserPublic[] = await result
			.then(async (r) => {
				const usersBlocked = r.map((v) => v.blockId);
				const users: UserPublic[] = [];
				for await (const id of usersBlocked) {
					users.push(
						await (await this.userService.getByPK(id)).getPublic(),
					);
				}
				return users;
			})
			.catch((err) => {
				throw new BadRequestException(err);
			});
		return values;
	}

	async getBlockedUserSearch(
		user: UserService,
		search: QueryBlock,
	): Promise<OkResponseGetBlock> {
		return {
			results: await this.getBlockedUser(user, search),
			currentPage: search.page,
			limit: search.limit,
		};
	}

	async unblock(user: UserService, unblockUserId: number): Promise<void> {
		const sql = `DELETE FROM block \
		WHERE userId = ${user.getId()} AND blockId = ${unblockUserId};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		await result;
	}

	async getBlockedCount(user: UserService): Promise<number> {
		const sql = `SELECT COUNT(*) FROM block WHERE userId = ${user.getId()};`;
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

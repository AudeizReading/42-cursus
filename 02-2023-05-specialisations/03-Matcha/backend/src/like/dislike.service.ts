import {
	ConflictException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { IDatabaseDislike, IDislike } from './dislike.interface';
import { ADatabaseRelationUser } from '$app/database/ADatabaseRelationUser';
import { UserService } from '$app/user/user.service';
import { ADatabase } from '$app/database/ADatabase';

@Injectable()
export class DislikeService extends ADatabaseRelationUser<
	IDatabaseDislike,
	DislikeService,
	IDislike
> {
	private dislikeId: number;

	constructor() {
		super(DislikeService, 'dislike');
		this.userService = new UserService();
	}

	deserialize(db: IDatabaseDislike): void {
		this.id = db.id;
		this.userId = db.userId;
		this.dislikeId = db.dislikeId;
	}

	normalize(): IDislike {
		const { id, userId, dislikeId } = this;
		return {
			id,
			userId,
			dislikeId,
		};
	}

	public async profilIsDislike(userId: number): Promise<boolean> {
		const sql = `SELECT * FROM dislike \
		WHERE userId = ${this.getUserId()} AND dislikeId = ${userId};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((value: Array<IDislike>) => {
				return value.length > 0;
			})
			.catch((err) => {
				throw new Error(err);
			});
	}

	async setDislikeId(userId: number): Promise<void> {
		const userService = this.userService.newInstance();
		const user = await userService.getByPK(userId);
		if (!(await user.isComplete())) {
			throw new ForbiddenException('This profil is not complete');
		}
		if (typeof userId != 'number' || userId <= 0)
			throw new Error(`'${userId}' is not valid UserID`);
		if (userId == this.getUserId()) {
			throw new ConflictException('Dislike your profil is not possible');
		}
		if (await this.profilIsDislike(userId)) {
			throw new ConflictException(
				'You have already dislike this profile',
			);
		}
		this.dislikeId = userId;
	}

	async setDislike(user: UserService): Promise<void> {
		await this.setDislikeId(user.getId());
	}

	getDislikeId(): number {
		return this.dislikeId;
	}
}

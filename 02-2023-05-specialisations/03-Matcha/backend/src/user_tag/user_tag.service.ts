import { Injectable } from '@nestjs/common';
import { UserService } from '$user/user.service';
import { TagService } from '$tag/tag.service';
import { IDatabaseUserTag, IUserTag } from '$user_tag/user_tag.interface';
import { ADatabaseRelationUser } from '$database/ADatabaseRelationUser';
import { ADatabase } from '$database/ADatabase';

@Injectable()
export class UserTagService extends ADatabaseRelationUser<
	IDatabaseUserTag,
	UserTagService,
	IUserTag
> {
	private tagId: number;

	constructor() {
		super(UserTagService, 'user_tag');
		this.userService = new UserService();
	}

	setTagId(tagId: number): void {
		this.tagId = tagId;
	}

	getTagId(): number {
		return this.tagId;
	}

	setTag(tag: TagService): void {
		this.setTagId(tag.getId());
	}

	async getTag(): Promise<TagService> {
		const tagService = new TagService();
		return await tagService.getByPK(this.getTagId());
	}

	deserialize(db: IDatabaseUserTag): void {
		this.setId(db.id);
		this.setTagId(db.tagId);
		this.setUserId(db.userId);
	}

	async getUsersUsingTag(tag: TagService): Promise<UserService[]> {
		const userTags = (await this.get(
			tag.getId(),
			'tagId',
		)) as UserTagService[];
		const userServicePromise: Promise<UserService>[] = userTags.map(
			async (userTag) => await userTag.getUser(),
		);
		return await Promise.all(userServicePromise);
	}

	async getTagsUsingUser(user: UserService): Promise<TagService[]> {
		const userTags = (await this.get(
			user.getId(),
			'userId',
		)) as UserTagService[];
		const tagServicePromise: Promise<TagService>[] = userTags.map(
			async (userTag) => await userTag.getTag(),
		);
		return await Promise.all(tagServicePromise);
	}

	async getByUserTag(
		user: UserService,
		tag: TagService,
	): Promise<UserTagService> {
		const sql = `SELECT * FROM ${this.getTableName()} WHERE \
			tagId = ${tag.getId()} AND userId = ${user.getId()}`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		const value = await result
			.then((v) => v)
			.catch((err) => {
				throw new Error(err.message);
			});
		const me = new UserTagService();
		me.deserialize(value[0] as IDatabaseUserTag);
		return me;
	}

	normalize(): IUserTag {
		const { id, tagId, userId } = this;
		return { id, tagId, userId };
	}
}

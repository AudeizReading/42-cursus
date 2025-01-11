import { ADatabaseRelationUser } from '$app/database/ADatabaseRelationUser';
import { Injectable } from '@nestjs/common';
import {
	IDatabaseDefaultPicture,
	IDefaultPicture,
} from './default_picture.interface';
import { UserService } from '$app/user/user.service';
import { FileService } from '$app/file/file.service';

@Injectable()
export class DefaultPictureService extends ADatabaseRelationUser<
	IDatabaseDefaultPicture,
	DefaultPictureService,
	IDefaultPicture
> {
	private fileId: number;
	private fileService: FileService;

	constructor() {
		super(DefaultPictureService, 'default_picture', ['fileService']);
		this.fileService = new FileService();
		this.userService = new UserService();
	}

	setFileId(fileId: number): void {
		this.fileId = fileId;
	}

	getFileId(): number {
		return this.fileId;
	}

	deserialize(db: IDatabaseDefaultPicture): void {
		this.setId(db.id);
		this.setUserId(db.userId);
		this.setFileId(db.fileId);
	}

	normalize(): IDefaultPicture {
		const { id, fileId, userId } = this;
		return {
			id,
			fileId,
			userId,
		};
	}

	async recover(user: UserService): Promise<void> {
		this.setUser(user);
		const tmp = await this.get(user.getId(), 'userId');
		if (tmp.length != 1) throw new Error('Recover is not possible');
		this.setFileId(tmp[0].getFileId());
		this.setId(tmp[0].getId());
	}

	async getFile(): Promise<FileService> {
		return await this.fileService.getById(this.getFileId());
	}
}

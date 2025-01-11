import { Injectable, NotFoundException } from '@nestjs/common';
import { IDatabaseUserFile, IUserFile } from '$user_file/user_file.interface';
import { ADatabaseRelationUser } from '$database/ADatabaseRelationUser';
import { UserService } from '$user/user.service';
import { ADatabase } from '$database/ADatabase';
import { Context, IDatabaseFile } from '$file/file.interface';
import { FileService } from '$app/file/file.service';
import { IDatabaseUser } from '$app/user/user.interface';

@Injectable()
export class UserFileService extends ADatabaseRelationUser<
	IDatabaseUserFile,
	UserFileService,
	IUserFile
> {
	private fileId: number;
	private fileService: FileService;

	constructor() {
		super(UserFileService, 'user_file', ['fileService']);
		this.userService = new UserService();
		this.fileService = new FileService();
	}

	setFileId(fileId: number): void {
		this.fileId = fileId;
	}

	getFileId(): number {
		return this.fileId;
	}

	deserialize(db: IDatabaseUserFile): void {
		this.setId(db.id);
		this.setFileId(db.fileId);
		this.setUserId(db.userId);
	}

	normalize(): IUserFile {
		const { id, fileId, userId } = this;
		return { id, fileId, userId };
	}

	private async getMediaUser(
		userId: number,
		context: Context,
	): Promise<FileService[]> {
		const sql = `SELECT * FROM user \
			JOIN user_file ON user.id = user_file.userId \
			JOIN file ON user_file.fileId = file.id \
			WHERE user.id = ${userId} AND file.context LIKE "${context}";`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		const value = await result
			.then(
				(
					v: (IDatabaseFile & IDatabaseUser & IDatabaseUserFile)[],
				): IDatabaseFile[] => {
					return v.map((vv) => {
						return {
							id: vv.fileId,
							name: vv.name,
							originalName: vv.originalName,
							context: vv.context,
							type: vv.type,
							duration: vv.duration,
							width: vv.width,
							height: vv.height,
							size: vv.size,
						};
					});
				},
			)
			.catch((err) => {
				throw new Error(err.message);
			});
		return value.map((v) => {
			const instance = this.fileService.newInstance();
			instance.deserialize(v);
			return instance;
		});
	}

	async getFileByName(name: string): Promise<FileService> {
		return await this.fileService.getByName(name);
	}

	async getFileById(id: number): Promise<FileService> {
		return await this.fileService.getById(id);
	}

	async getPictureProfilUser(user: UserService): Promise<FileService[]> {
		return await this.getMediaUser(user.getId(), 'PROFIL');
	}

	private async deleteEntry(
		user: UserService,
		identified: string | number,
		by: 'name' | 'id',
	): Promise<void> {
		const userFileServices: UserFileService[] = await this.get(
			user.getId(),
			'userId',
		);
		for await (const userFileService of userFileServices) {
			const fileService =
				by == 'name'
					? await userFileService.getFileByName(identified as string)
					: await userFileService.getFileById(identified as number);
			if (
				by == 'name'
					? fileService.getName() == identified
					: fileService.getId() == identified
			) {
				fileService.deleteFile();
				await fileService.delete();
				await userFileService.delete();
				return;
			}
		}
		throw new NotFoundException('File is not found');
	}

	async deleteByName(user: UserService, name: string): Promise<void> {
		await this.deleteEntry(user, name, 'name');
	}

	async deleteById(user: UserService, id: number): Promise<void> {
		await this.deleteEntry(user, id, 'id');
	}
}

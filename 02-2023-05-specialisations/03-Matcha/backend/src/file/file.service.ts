import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Context, IDatabaseFile, IFile, Type } from './file.interface';
import { ADatabase } from '$database/ADatabase';
import * as fs from 'fs';
import { TokenService } from '$token/token.service';
import * as IS from 'image-size';
import * as MM from 'music-metadata/lib/core';
import * as ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';

@Injectable()
export class FileService extends ADatabase<IDatabaseFile, FileService, IFile> {
	private name: string;
	private originalName: string;
	private type: Type;
	private context: Context;
	private duration: number;
	private width: number;
	private height: number;
	private size: number;
	private loggerService: Logger;

	private static racineProject = `${process.cwd()}`;
	private static dirFileName = 'uploadFile';
	public static uploadDir = `${FileService.racineProject}/${FileService.dirFileName}`;

	constructor() {
		super(FileService, 'file', [
			'racineProject',
			'dirFileName',
			'uploadDir',
			'loggerService',
		]);
		this.loggerService = new Logger();
		if (!fs.existsSync(FileService.uploadDir)) {
			fs.mkdirSync(FileService.uploadDir);
		}
	}

	private setName(name: string): void {
		this.name = name;
	}

	getName(): string {
		return this.name;
	}

	private setOriginalName(originalName: string): void {
		this.originalName = originalName;
	}

	getOriginalName(): string {
		return this.originalName;
	}

	private setType(type: Type): void {
		this.type = type;
	}

	getType(): Type {
		return this.type;
	}

	private setContext(context: Context): void {
		this.context = context;
	}

	getContext(): Context {
		return this.context;
	}

	private setDuration(duration: number): void {
		this.duration = duration;
	}

	getDuration(): number {
		return this.duration;
	}

	private setWidth(width: number): void {
		this.width = width;
	}

	getWidth(): number {
		return this.width;
	}

	private setHeight(height: number): void {
		this.height = height;
	}

	getHeight(): number {
		return this.height;
	}

	private setSize(size: number): void {
		this.size = size;
	}

	getSize(): number {
		return this.size;
	}

	normalize(): IFile {
		const { id, name, originalName, context, type, size } = this;
		const data = {
			id,
			name,
			originalName,
			context,
			type,
			size,
			url: `/api/v1/file/${name}`,
		};
		switch (type) {
			case 'AUDIO':
				return { ...data, duration: this.duration };
			case 'PICTURE':
				return { ...data, width: this.width, height: this.height };
			case 'VIDEO':
				return {
					...data,
					width: this.width,
					height: this.height,
					duration: this.duration,
				};
			default:
				return data;
		}
	}

	deserialize(db: IDatabaseFile): void {
		this.setId(db.id);
		this.setName(db.name);
		this.setOriginalName(db.originalName);
		this.setType(db.type as Type);
		this.setContext(db.context as Context);
		this.setSize(db.size);
		switch (this.getType()) {
			case 'AUDIO':
				this.setDuration(db.duration);
				break;
			case 'PICTURE':
				this.setWidth(db.width);
				this.setHeight(db.height);
				break;
			case 'VIDEO':
				this.setDuration(db.duration);
				this.setWidth(db.width);
				this.setHeight(db.height);
				break;
		}
	}

	private async setAudioMeta(buffer: Buffer): Promise<void> {
		try {
			const value = await MM.parseBuffer(buffer);
			this.setDuration(value.format.duration);
		} catch {
			throw new Error('This file is not Audio');
		}
	}

	private setPictureMeta(buffer: Buffer): void {
		const value = IS.imageSize(buffer);
		this.setWidth(value.width);
		this.setHeight(value.height);
		if (!value.type) {
			throw new Error('This file is not Image');
		}
	}

	private async setVideoMeta(buffer: Buffer): Promise<void> {
		try {
			const inputFFMPEG = ffmpeg().input(Readable.from(buffer));
			const value: { duration: string; width: number; height: number } =
				await new Promise((resolve, reject) => {
					inputFFMPEG.ffprobe((err, data) => {
						const streams = data.streams.filter(
							(v) => v.codec_type == 'video',
						);
						if (err || streams.length != 1) {
							reject(new Error('This file is not video'));
						}
						resolve({
							duration: streams[0].duration,
							width: streams[0].width,
							height: streams[0].height,
						});
					});
				});
			if (value.duration == 'N/A') {
				this.setDuration(-1);
			} else {
				this.setDuration(Number.parseFloat(value.duration));
			}
			this.setWidth(value.width);
			this.setHeight(value.height);
		} catch (err) {
			throw err;
		}
	}

	private reset(): void {
		this.name = undefined;
		this.originalName = undefined;
		this.type = undefined;
		this.context = undefined;
		this.duration = undefined;
		this.width = undefined;
		this.height = undefined;
		this.size = undefined;
	}

	async createFile(
		buffer: Buffer,
		originalName: string,
		type: Type,
		context: Context,
	): Promise<IFile> {
		const name = TokenService.generateUUID();
		const filePath = `${FileService.uploadDir}/${name}`;
		try {
			fs.writeFileSync(filePath, buffer);
			this.setName(name);
			this.setOriginalName(originalName);
			this.setType(type);
			this.setContext(context);
			this.setSize(buffer.length);
			switch (type) {
				case 'AUDIO':
					await this.setAudioMeta(buffer);
					break;
				case 'PICTURE':
					this.setPictureMeta(buffer);
					break;
				case 'VIDEO':
					await this.setVideoMeta(buffer);
					break;
			}
			await this.update();
		} catch (e) {
			this.loggerService.error(e, 'FileService');
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}
			this.reset();
		}
		return this.normalize();
	}

	deleteFile(): void {
		const filePath = `${FileService.uploadDir}/${this.getName()}`;
		if (!fs.existsSync(filePath)) throw new Error('File not found');
		fs.unlinkSync(filePath);
	}

	async getByName(name: string): Promise<FileService> {
		try {
			const fileValue = await this.get(name, 'name');
			if (fileValue.length != 1) {
				throw new Error('Get by name file is not possible');
			}
			return fileValue[0];
		} catch {
			throw new NotFoundException('Media not found');
		}
	}

	async getById(id: number): Promise<FileService> {
		try {
			const fileValue = await this.get(id, 'id');
			if (fileValue.length != 1) {
				throw new Error('Get by name file is not possible');
			}
			return fileValue[0];
		} catch {
			throw new NotFoundException('Media not found');
		}
	}
}

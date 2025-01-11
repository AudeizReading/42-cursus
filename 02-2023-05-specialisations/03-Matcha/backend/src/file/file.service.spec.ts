import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import * as fs from 'fs';
import { assetsFilesPath } from '$test/assets/assets.module';
import { Context, IFile, Type } from './file.interface';
import { forwardRef } from '@nestjs/common';
import { UserModule } from '$app/user/user.module';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('FileService', () => {
	let service: FileService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [forwardRef(() => UserModule)],
			providers: [FileService],
		}).compile();

		service = module.get<FileService>(FileService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Create file', () => {
		const sendFile = (
			testName: string,
			filePath: string,
			fileName: string,
			typeFile: Type,
			context: Context,
		): void =>
			it(testName, async () => {
				const bufferFile = fs.readFileSync(filePath);
				const instance = service.newInstance();
				const data = await instance.createFile(
					bufferFile,
					fileName,
					typeFile,
					context,
				);
				const baseReturn: IFile = {
					id: expect.any(Number),
					name: expect.any(String),
					originalName: fileName,
					context: context,
					type: typeFile,
					size: expect.any(Number),
					url: `/api/v1/file/${data.name}`,
				};
				expect(instance.getId()).toBe(data.id);
				expect(instance.getName()).toBe(data.name);
				expect(instance.getOriginalName()).toBe(data.originalName);
				expect(instance.getContext()).toBe(data.context);
				expect(instance.getType()).toBe(data.type);
				expect(instance.getSize()).toBe(data.size);
				const audioReturn: IFile = {
					...baseReturn,
					duration: expect.any(Number),
				};
				const pictureReturn: IFile = {
					...baseReturn,
					width: expect.any(Number),
					height: expect.any(Number),
				};
				const videoRetrun: IFile = {
					...baseReturn,
					...audioReturn,
					...pictureReturn,
				};
				switch (typeFile) {
					case 'AUDIO':
						expect(data).toMatchObject<IFile>(audioReturn);
						expect(instance.getDuration()).toBe(data.duration);
						break;
					case 'PICTURE':
						expect(data).toMatchObject<IFile>(pictureReturn);
						expect(instance.getWidth()).toBe(data.width);
						expect(instance.getHeight()).toBe(data.height);
						break;
					case 'VIDEO':
						expect(data).toMatchObject<IFile>(videoRetrun);
						expect(instance.getDuration()).toBe(data.duration);
						expect(instance.getWidth()).toBe(data.width);
						expect(instance.getHeight()).toBe(data.height);
						break;
				}
			});

		const sendTypeFile = (
			type: string,
			files: string[],
			typeFile: Type,
			context: Context,
		): void => {
			describe(type, () => {
				files.forEach((filePath) => {
					const filePathSplit = filePath.split('/');
					const fileName = filePathSplit[filePathSplit.length - 1];
					return sendFile(
						`${type}: ${fileName}`,
						filePath,
						fileName,
						typeFile,
						context,
					);
				});
			});
		};

		sendTypeFile('picture', assetsFilesPath.picture, 'PICTURE', 'PROFIL');
		sendTypeFile('audio', assetsFilesPath.audio, 'AUDIO', 'CHAT');
		sendTypeFile('video', assetsFilesPath.video, 'VIDEO', 'CHAT');
	});
});

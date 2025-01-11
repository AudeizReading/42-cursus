import {
	Get,
	Param,
	Post,
	Delete,
	Res,
	StreamableFile,
	Request,
	UseInterceptors,
	UploadedFile,
	BadRequestException,
	HttpCode,
	Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Controller } from '$app/app.decorator';
import { IFile, IFileRequest } from './file.interface';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { UseGuards } from '$security/security.decorator';
import { Api } from './file.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendFileChatDto } from './file.schema';
import { ApiTags } from '@nestjs/swagger';

@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Api('getFile')
	@UseGuards('notAuth')
	@Get(':uuid')
	async getFile(
		@Param('uuid') fileName: string,
		@Res({ passthrough: true }) res: Response,
	): Promise<StreamableFile> {
		const data = (await this.fileService.getByName(fileName)).normalize();
		const file = createReadStream(`${FileService.uploadDir}/${fileName}`);
		res.set({
			'Content-Type':
				data.type == 'PICTURE'
					? 'image/*'
					: `${data.type.toLowerCase()}/*`,
			'Content-Disposition': `attachment; filename=${data.originalName}`,
		});
		return new StreamableFile(file);
	}

	@Api('getInfoFile')
	@UseGuards('notAuth')
	@Get('info/:uuid')
	async getInfoFile(@Param('uuid') fileName: string): Promise<IFile> {
		return (await this.fileService.getByName(fileName)).normalize();
	}

	@Api('addPictureProfil')
	@UseGuards('auth')
	@Post('profile')
	@UseInterceptors(FileInterceptor('file'))
	async addPictureProfil(
		@Request() req: IFileRequest,
		@UploadedFile() file: Express.Multer.File,
	): Promise<IFile> {
		if ((await req.user.getPictureProfil()).length >= 5) {
			throw new BadRequestException(
				'You have already uploaded the maximum number of \
			allowed photos (5). No additional photos can be uploaded.',
			);
		}
		return await req.user.addPictureToProfil(
			file.buffer,
			file.originalname,
		);
	}

	@Api('deleteMediaUserByName')
	@UseGuards('auth')
	@Delete(':uuid')
	@HttpCode(200)
	async deleteMediaUserByName(
		@Request() req: IFileRequest,
		@Param('uuid') fileName: string,
	): Promise<void> {
		await req.user.removePictureByName(fileName);
	}

	@Api('deleteMediaUserById')
	@UseGuards('auth')
	@Delete('id/:id')
	@HttpCode(200)
	async deleteMediaUserById(
		@Request() req: IFileRequest,
		@Param('id') id: string,
	): Promise<void> {
		await req.user.removePictureById(Number.parseInt(id));
	}

	@ApiTags('Chat')
	@Api('sendPictureToChat')
	@UseGuards('profilCompleted')
	@Post('chat/picture')
	@UseInterceptors(FileInterceptor('file'))
	async sendPictureToChat(
		@Request() req: IFileRequest,
		@UploadedFile() file: Express.Multer.File,
		@Body() sendFileChatDto: SendFileChatDto,
	): Promise<IFile> {
		const me = req.user;
		const buffer = file.buffer;
		const originalName = file.originalname;
		return await me.addPictureToChat(
			buffer,
			originalName,
			sendFileChatDto.userId,
		);
	}

	@ApiTags('Chat')
	@Api('sendVideoToChat')
	@UseGuards('profilCompleted')
	@Post('chat/video')
	@UseInterceptors(FileInterceptor('file'))
	async sendVideoToChat(
		@Request() req: IFileRequest,
		@UploadedFile() file: Express.Multer.File,
		@Body() sendFileChatDto: SendFileChatDto,
	): Promise<IFile> {
		const me = req.user;
		const buffer = file.buffer;
		const originalName = file.originalname;
		return await me.addVideoToChat(
			buffer,
			originalName,
			sendFileChatDto.userId,
		);
	}

	@ApiTags('Chat')
	@Api('sendAudioToChat')
	@UseGuards('profilCompleted')
	@Post('chat/audio')
	@UseInterceptors(FileInterceptor('file'))
	async sendAudioToChat(
		@Request() req: IFileRequest,
		@UploadedFile() file: Express.Multer.File,
		@Body() sendFileChatDto: SendFileChatDto,
	): Promise<IFile> {
		const me = req.user;
		const buffer = file.buffer;
		const originalName = file.originalname;
		return await me.addAudioToChat(
			buffer,
			originalName,
			sendFileChatDto.userId,
		);
	}

	@ApiTags('Event')
	@Api('addPictureToEvent')
	@UseGuards('profilCompleted')
	@Post('event')
	@UseInterceptors(FileInterceptor('file'))
	async addPictureToEvent(
		@UploadedFile() file: Express.Multer.File,
	): Promise<IFile> {
		const buffer = file.buffer;
		const originalName = file.originalname;
		const fileService = this.fileService.newInstance();
		return await fileService.createFile(
			buffer,
			originalName,
			'PICTURE',
			'EVENT',
		);
	}
}

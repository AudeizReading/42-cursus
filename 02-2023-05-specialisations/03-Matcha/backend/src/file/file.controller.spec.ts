import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$app/user/user.module';
import { SocketModule } from '$app/socket/socket.module';
import { ChatModule } from '$app/chat/chat.module';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('FileController', () => {
	let controller: FileController;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule,
				ConfigModule.forRoot({
					load: [configuration],
				}),
				UserModule,
				SocketModule,
				ChatModule,
			],
			controllers: [FileController],
			providers: [FileService, Logger],
		}).compile();

		controller = module.get<FileController>(FileController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

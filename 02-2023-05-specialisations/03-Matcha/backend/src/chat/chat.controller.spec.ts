import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$app/user/user.module';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import { SocketModule } from '$app/socket/socket.module';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('ChatController', () => {
	let controller: ChatController;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				JwtModule,
				UserModule,
				SocketModule,
			],
			controllers: [ChatController],
			providers: [Logger, ChatService],
		}).compile();

		controller = module.get<ChatController>(ChatController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

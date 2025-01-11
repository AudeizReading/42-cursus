import { Test, TestingModule } from '@nestjs/testing';
import { SocketService } from './socket.service';
import { Logger } from '@nestjs/common';
import { UserModule } from '$app/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import configuration from '$config/configuration';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from '$app/chat/chat.module';
import { NotificationModule } from '$app/notification/notification.module';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('SocketService', () => {
	let service: SocketService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				UserModule,
				JwtModule,
				ChatModule,
				NotificationModule,
			],
			providers: [Logger, SocketService],
		}).compile();

		service = module.get<SocketService>(SocketService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { UserModule } from '$app/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from '$app/chat/chat.module';
import { NotificationModule } from '$app/notification/notification.module';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('SocketGateway', () => {
	let gateway: SocketGateway;

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
			providers: [Logger, SocketGateway, SocketService],
		}).compile();

		gateway = module.get<SocketGateway>(SocketGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});

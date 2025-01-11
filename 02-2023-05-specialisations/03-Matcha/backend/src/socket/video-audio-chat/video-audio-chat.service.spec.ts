import { Test, TestingModule } from '@nestjs/testing';
import { VideoAudioChatService } from './video-audio-chat.service';
import { UserModule } from '$app/user/user.module';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

describe('VideoAudioChatService', () => {
	let service: VideoAudioChatService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [UserModule],
			providers: [VideoAudioChatService, Logger],
		}).compile();

		service = module.get<VideoAudioChatService>(VideoAudioChatService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserTagService } from '$user_tag/user_tag.service';
import { IDatabaseUserTag } from '$user_tag/user_tag.interface';
import { ADatabase } from '$app/database/ADatabase';

describe('UserTagService', () => {
	let service: UserTagService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserTagService],
		}).compile();

		service = module.get<UserTagService>(UserTagService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('Normalize', () => {
		const userTagService = service.newInstance();
		userTagService.setId(42);
		userTagService.setUserId(42);
		userTagService.setTagId(42);
		const data = userTagService.normalize();
		expect(data).toMatchObject<IDatabaseUserTag>({
			id: expect.any(Number),
			tagId: expect.any(Number),
			userId: expect.any(Number),
		});
	});
});

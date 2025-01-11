import { Test, TestingModule } from '@nestjs/testing';
import { GenderController } from './gender.controller';
import { GenderService } from './gender.service';
import { OkResponseGetGenders } from './gender.schema';
import { ADatabase } from '$app/database/ADatabase';

describe('GenderController', () => {
	let controller: GenderController;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GenderController],
			providers: [GenderService],
		}).compile();

		controller = module.get<GenderController>(GenderController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('getGenders', () => {
		expect(controller.getGenders()).toMatchObject<OkResponseGetGenders>({
			genders: ['Man', 'Woman'],
		});
	});
});

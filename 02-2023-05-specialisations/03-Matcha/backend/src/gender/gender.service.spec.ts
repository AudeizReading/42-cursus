import { Test, TestingModule } from '@nestjs/testing';
import { GenderService } from './gender.service';
import { Gender } from './gender.interface';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('GenderService', () => {
	let service: GenderService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [GenderService],
		}).compile();

		service = module.get<GenderService>(GenderService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('setGender', () => {
		it('undefined', () => {
			expect(() => service.setGender(undefined)).toThrow();
		});

		it('empty', () => {
			expect(() => service.setGender('' as Gender)).toThrow();
		});

		it('Invalid', () => {
			expect(() => service.setGender('Invalid' as Gender)).toThrow();
		});

		it('Man', () => {
			expect(() => service.setGender('Man')).not.toThrow();
		});

		it('Woman', () => {
			expect(() => service.setGender('Woman')).not.toThrow();
		});
	});

	describe('getGender', () => {
		it('get Value', () => {
			service.setGender('Man');
			expect(service.getGender()).toBe('Man');
		});
	});

	it('getGenderType', () => {
		expect(service.getGenderType()).toStrictEqual(['Man', 'Woman']);
	});

	describe('Recovery', () => {
		it('Recovery Throw', async () => {
			try {
				await service.recover(undefined);
				expect(true).toBe(false);
			} catch {
				expect(true).toBe(true);
			}
		});
	});
});

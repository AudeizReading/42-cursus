import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { ITag } from './tag.interface';
import { GetTagReturn, TagType } from './tag.schema';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('TagService', () => {
	let service: TagService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [TagService],
		}).compile();

		service = module.get<TagService>(TagService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('CreateMultiTagInDb', () => {
		const tags = [
			'TagServiceCreateTagInDB0',
			'TagServiceCreateTagInDB1',
			'TagServiceCreateTagInDB2',
			'TagServiceCreateTagInDB3',
		];
		tags.forEach((tagName, index) => {
			it(`CreateTagInDB ${index}`, async () => {
				const tagService = service.newInstance();
				tagService.setName(tagName);
				await expect(tagService.update()).resolves.not.toThrow();
			});
		});
	});

	describe('validTagName', () => {
		it('undefined tag name', () => {
			expect(TagService.validTagName(undefined)).toBe(false);
		});

		it('Not valid tag name', () => {
			expect(TagService.validTagName('My Super Tag Name')).toBe(false);
		});
	});

	describe('setName', () => {
		it('set invalid tag name', () => {
			const tagService = service.newInstance();
			expect(() => tagService.setName('a')).toThrow();
		});
	});

	describe('getName', () => {
		let instance: TagService;

		it('define instance', () => {
			instance = service.newInstance();
		});

		it('Not name not define', () => {
			expect(() => instance.getName()).toThrow();
		});

		it('Valid tag Name', () => {
			const name = 'MySuperTagName';
			instance.setName(name);
			expect(instance.getName()).toBe(name);
		});
	});

	describe('deserialize', () => {
		let instance: TagService;

		it('define instance', () => {
			instance = service.newInstance();
		});

		it('deserialize valid data', () => {
			const id = 1;
			const name = 'testos';
			instance.deserialize({ id, name });
			expect(instance.getName()).toBe(name);
			expect(instance.getId()).toBe(id);
		});
	});

	describe('normalize', () => {
		let instance: TagService;

		it('define instance', () => {
			instance = service.newInstance();
		});

		it('normalize valid data', () => {
			const id = 1;
			const name = 'testos';
			instance.deserialize({ id, name });
			expect(instance.normalize()).toMatchObject<ITag>({
				id,
				name,
			});
		});
	});

	describe('search', () => {
		let instance: TagService;

		it('define instance', () => {
			instance = service.newInstance();
		});

		it('Search TagServiceCreateTagInDB', async () => {
			const result = await instance.search({
				limit: 5,
				page: 0,
				search: 'TagServiceCreateTagInDB',
			});
			expect(result).toMatchObject<GetTagReturn>({
				results: expect.anything(),
				limit: 5,
				currentPage: 0,
				totalPage: expect.any(Number),
			});
			const results = result.results;
			results.forEach((r, i) => {
				expect(r).toMatchObject<TagType>({
					id: expect.any(Number),
					name: `TagServiceCreateTagInDB${i}`,
				});
			});
		});
	});

	describe('getByName', () => {
		let instance: TagService;

		it('define instance', () => {
			instance = service.newInstance();
		});

		it('Get TagServiceCreateTagInDB0', async () => {
			const currentTagService = await instance.getByName(
				'TagServiceCreateTagInDB0',
			);
			expect(currentTagService instanceof TagService);
			expect(currentTagService.getName()).toBe(
				'TagServiceCreateTagInDB0',
			);
		});

		it('Get thow error', async () => {
			try {
				await instance.getByName('a');
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
			}
		});
	});
});

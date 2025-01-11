import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { UserService } from '$user/user.service';
import { ITagRequest } from './tag.interface';
import {
	DeleteTag,
	GetTagReturn,
	PostTag,
	TagOkReturn,
	TagType,
} from './tag.schema';
import { BadRequestException, Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

describe('TagController', () => {
	let controller: TagController;
	let userService: UserService;
	let user: UserService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TagController],
			providers: [TagService, Logger],
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				UserModule,
				JwtModule,
			],
		}).compile();

		controller = module.get<TagController>(TagController);
		userService = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('create user for test', () => {
		user = userService.new({
			username: `UserTag`,
			hashPassword: UserService.passwordToHash('Password42@'),
			firstName: 'firstname',
			lastName: 'lastname',
			email: `usertag@example.fr`,
		});
		expect(async () => await user.update()).not.toThrow();
	});

	describe('Add Tag', () => {
		it('Not Login add', async () => {
			try {
				await controller.addTag(undefined, { tag: `addTagTest0` });
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('statusCode');
				expect(error.response).toHaveProperty('message');
			}
		}, 10000);

		for (let i = 0; i < 100; i++) {
			it(`Add tag addTagTest${i}`, async () => {
				const req: ITagRequest = { user };
				const body: PostTag = { tag: `addTagTest${i}` };
				expect(
					await controller.addTag(req, body),
				).toMatchObject<TagOkReturn>({
					message: 'Tag add success',
					tag: {
						id: expect.any(Number),
						name: `addTagTest${i}`,
					},
				});
			}, 10000);
		}
	});

	describe('Delete Tag', () => {
		it('Not Login delete', async () => {
			try {
				await controller.removeTag(undefined, { tag: `addTagTest0` });
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.response).toHaveProperty('error');
				expect(error.response).toHaveProperty('statusCode');
				expect(error.response).toHaveProperty('message');
			}
		}, 10000);

		for (let i = 50; i < 100; i++) {
			it(`Remove tag addTagTest${i}`, async () => {
				const req: ITagRequest = { user };
				const body: DeleteTag = { tag: `addTagTest${i}` };
				expect(
					await controller.removeTag(req, body),
				).toMatchObject<TagOkReturn>({
					message: 'Tag delete with success',
					tag: {
						id: expect.any(Number),
						name: `addTagTest${i}`,
					},
				});
			}, 10000);
		}
	});

	describe('Get tag', () => {
		it('Valid Params search: addTagTest limit: 1 page: 0', async () => {
			const params = {
				search: 'addTagTest',
				limit: 1,
				page: 0,
			};
			const resultValue = await controller.getTags(params);
			expect(resultValue).toMatchObject<GetTagReturn>({
				limit: expect.any(Number),
				results: expect.anything(),
				currentPage: expect.any(Number),
				totalPage: expect.any(Number),
			});
			const results = resultValue.results;
			results.forEach((result) => {
				expect(result).toMatchObject<TagType>({
					id: expect.any(Number),
					name: 'addTagTest0',
				});
			});
		});

		it('Valid Params search: addTagTest', async () => {
			const params = {
				search: 'addTagTest',
			};
			const resultValue = await controller.getTags(params);
			expect(resultValue).toMatchObject<GetTagReturn>({
				limit: expect.any(Number),
				results: expect.anything(),
				currentPage: expect.any(Number),
				totalPage: expect.any(Number),
			});
			const results = resultValue.results;
			results.forEach((result, i) => {
				expect(result).toMatchObject<TagType>({
					id: expect.any(Number),
					name: `addTagTest${i}`,
				});
			});
		});

		describe('security', () => {
			it('params undefined', async () => {
				const resultValue = await controller.getTags(undefined);
				expect(resultValue).toMatchObject<GetTagReturn>({
					limit: 5,
					results: expect.anything(),
					currentPage: 0,
					totalPage: expect.any(Number),
				});
			});

			it('Object is undefined', async () => {
				const resultValue = await controller.getTags({});
				expect(resultValue).toMatchObject<GetTagReturn>({
					limit: 5,
					results: expect.anything(),
					currentPage: 0,
					totalPage: expect.any(Number),
				});
			});

			it('limit is string', async () => {
				const resultValue = await controller.getTags({
					limit: '5' as unknown as number,
				});
				expect(resultValue).toMatchObject<GetTagReturn>({
					limit: 5,
					results: expect.anything(),
					currentPage: 0,
					totalPage: expect.any(Number),
				});
			});

			it('page is undefined', async () => {
				const resultValue = await controller.getTags({
					page: undefined,
				});
				expect(resultValue).toMatchObject<GetTagReturn>({
					limit: 5,
					results: expect.anything(),
					currentPage: 0,
					totalPage: expect.any(Number),
				});
			});

			it('page is string', async () => {
				const resultValue = await controller.getTags({
					page: 0 as unknown as number,
				});
				expect(resultValue).toMatchObject<GetTagReturn>({
					limit: 5,
					results: expect.anything(),
					currentPage: 0,
					totalPage: expect.any(Number),
				});
			});
		});
	});
});

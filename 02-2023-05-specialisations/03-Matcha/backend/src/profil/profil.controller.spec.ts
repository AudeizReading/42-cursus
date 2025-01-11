import { Test, TestingModule } from '@nestjs/testing';
import { ProfilController } from './profil.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '$user/user.service';
import { IUser } from '$user/user.interface';
import { TagModule } from '$tag/tag.module';
import { ViewModule } from '$app/view/view.module';
import { LikeModule } from '$app/like/like.module';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

describe('ProfilController', () => {
	let controller: ProfilController;
	let userService: UserService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule,
				JwtModule,
				UserModule,
				TagModule,
				ViewModule,
				LikeModule,
			],
			providers: [Logger, UserService],
			controllers: [ProfilController],
		}).compile();

		userService = module.get<UserService>(UserService);
		controller = module.get<ProfilController>(ProfilController);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('me', () => {
		it('Valid User', async () => {
			const user = userService.new({
				username: 'ProfilController-me',
				hashPassword: UserService.passwordToHash('Password42@'),
				firstName: 'firstname',
				lastName: 'lastname',
				email: 'ProfilController-me@example.fr',
			});
			await user.update();
			const req = { user };
			await expect(controller.me(req)).resolves.toMatchObject<IUser>({
				id: expect.any(Number),
				email: expect.any(String),
				username: expect.any(String),
				firstName: expect.any(String),
				lastName: expect.any(String),
				validateEmail: expect.any(Boolean),
				locationType: expect.any(String),
				status: expect.any(String),
				fameRating: expect.any(Number),
			});
		});
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { PictureFacebookController } from './picture-facebook.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$app/user/user.module';
import { PictureFacebookService } from './picture-facebook.service';
import { AuthModule } from '$app/auth/auth.module';
import { ADatabase } from '$app/database/ADatabase';

describe('PictureFacebookController', () => {
	let controller: PictureFacebookController;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule, JwtModule, UserModule, AuthModule],
			controllers: [PictureFacebookController],
			providers: [PictureFacebookService],
		}).compile();
		controller = module.get<PictureFacebookController>(
			PictureFacebookController,
		);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

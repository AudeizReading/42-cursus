import { Test, TestingModule } from '@nestjs/testing';
import { BlockController } from './block.controller';
import { ADatabase } from '$app/database/ADatabase';
import configuration from '$config/configuration';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$app/user/user.module';
import { BlockService } from './block.service';

describe('BlockController', () => {
	let controller: BlockController;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				JwtModule,
				UserModule,
			],
			controllers: [BlockController],
			providers: [BlockService],
		}).compile();

		controller = module.get<BlockController>(BlockController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

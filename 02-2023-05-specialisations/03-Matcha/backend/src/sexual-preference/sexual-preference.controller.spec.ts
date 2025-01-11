import { Test, TestingModule } from '@nestjs/testing';
import { SexualPreferenceController } from './sexual-preference.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$app/user/user.module';
import { SexualPreferenceService } from './sexual-preference.service';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

describe('SexualPreferenceController', () => {
	let controller: SexualPreferenceController;

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
			controllers: [SexualPreferenceController],
			providers: [SexualPreferenceService, Logger],
		}).compile();

		controller = module.get<SexualPreferenceController>(
			SexualPreferenceController,
		);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

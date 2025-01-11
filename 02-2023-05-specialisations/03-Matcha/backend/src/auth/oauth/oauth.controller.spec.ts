import { Test, TestingModule } from '@nestjs/testing';
import { OauthController } from './oauth.controller';
import { ConfigModule } from '@nestjs/config';
import { OauthService } from './oauth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$app/user/user.module';
import { AuthService } from '../auth.service';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

describe('OauthController', () => {
	let controller: OauthController;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule, JwtModule, UserModule],
			controllers: [OauthController],
			providers: [OauthService, AuthService, Logger],
		}).compile();

		controller = module.get<OauthController>(OauthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

import { NestFactory } from '@nestjs/core';
import {
	SwaggerModule,
	DocumentBuilder,
	SwaggerCustomOptions,
} from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';
import { AppModule } from '$app/app.module';
import { SwaggerThemeNameEnum } from 'swagger-themes/build/enums/swagger-theme-name';
import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	contributors,
	description,
	license,
	repository,
	version,
	name,
} from 'package.json';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

const swaggerUI = (url: string, app: INestApplication): void => {
	const name = 'Matcha API';
	const config = new DocumentBuilder()
		.setTitle(name)
		.setDescription(
			[
				`${description}\n\n`,
				'This API powers a dating web application\n\n',
				'#### Contributors\n',
				contributors
					.map(
						(contributor) =>
							`- ${contributor.name} | [Github](${contributor.url}) |
							[${contributor.email}](mailto:${contributor.email})`,
					)
					.join('\n'),
			].join(''),
		)
		.setLicense(license, `${repository.url.slice(0, -4)}/blob/main/LICENSE`)
		.setVersion(version)
		.setExternalDoc('Documentation for websocket (Socket.io)', '/api/async')
		.addBearerAuth(
			{
				type: 'http',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header',
				scheme: 'Bearer',
			},
			'JWT-auth',
		)
		.addTag('All')
		.addTag('Public')
		.addTag('Required Authentification')
		.addTag('Required Authentification Not Profile Completed Required')
		.addTag('Required Authentification And Profile Completed')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	const theme = new SwaggerTheme();
	const customCss = theme.getBuffer(SwaggerThemeNameEnum.DARK);
	const customSiteTitle = `${name} ${version}`;
	const swaggerOptions = {
		docExpansion: 'none',
		displayRequestDuration: true,
		persistAuthorization: true,
	};
	const optionsRestApi: SwaggerCustomOptions = {
		swaggerOptions,
		customCss,
		customSiteTitle,
	};
	SwaggerModule.setup(url, app, document, optionsRestApi);
};

const asyncApi = async (url: string, app: INestApplication): Promise<void> => {
	const asyncApiOptions = new AsyncApiDocumentBuilder()
		.setTitle('Matcha WS')
		.setDescription(description)
		.setVersion(version)
		.setDefaultContentType('application/json')
		.setLicense(license, `${repository.url.slice(0, -4)}/blob/main/LICENSE`)
		.addServer('matcha-ws', {
			url: 'ws://localhost:3000',
			protocol: 'socket.io',
		})
		.build();

	const asyncapiDocument = AsyncApiModule.createDocument(
		app,
		asyncApiOptions,
	);
	await AsyncApiModule.setup(url, app, asyncapiDocument);
};

const bootstrap = async (): Promise<void> => {
	const url = 'api';
	const urlSwagger = url;
	const urlAsyncApi = `/${url}/async`;
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);

	app.enableCors();
	app.setGlobalPrefix(`/${url}`);
	app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

	if (configService.get('swaggerUI')) {
		swaggerUI(urlSwagger, app);
		await asyncApi(urlAsyncApi, app);
	}

	await app.listen(configService.get('port'), '0.0.0.0');
	Logger.log(
		`${name} ${version} is running on: ${await app.getUrl()}`,
		'NestApplication',
	);
	Logger.log(`${await app.getUrl()}/api`, 'NestApplication');
	Logger.log(`${await app.getUrl()}/api/async`, 'NestApplication');
};

bootstrap();

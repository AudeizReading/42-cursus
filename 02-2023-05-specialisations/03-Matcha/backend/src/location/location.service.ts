import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Address } from './location.schema';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '$app/redis/redis.service';

@Injectable()
export class LocationService {
	constructor(
		private readonly loggerService: Logger,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
	) {}

	async locationToAddress(
		latitude: string,
		longitude: string,
	): Promise<Address> {
		const cacheKey = `location:${latitude}:${longitude}`;
		const values = await this.redisService.getValue(cacheKey);
		if (values != null) {
			this.loggerService.log(
				`Using cached value ${cacheKey}`,
				'LocationService',
			);
			return JSON.parse(values);
		}
		const apiKey = this.configService.getOrThrow('hereKey');
		const url = new URL(
			'https://revgeocode.search.hereapi.com/v1/revgeocode',
		);
		url.searchParams.append('at', `${latitude},${longitude}`);
		url.searchParams.append('lang', 'en-US');
		url.searchParams.append('apiKey', apiKey);
		const request = fetch(url);
		return await request
			.then(async (res) => {
				const values = await res.json();
				const items = values.items;
				if (items.length == 0) {
					throw new BadRequestException('Not value found');
				}
				const data = items[0] as Address;
				await this.redisService.setValue(
					cacheKey,
					JSON.stringify(data),
				);
				await this.redisService.redisClient.expire(cacheKey, 31536000);
				this.loggerService.log(
					`Create cached value ${cacheKey}`,
					'LocationService',
				);
				return data;
			})
			.catch((e) => {
				throw new BadRequestException(e);
			});
	}
}

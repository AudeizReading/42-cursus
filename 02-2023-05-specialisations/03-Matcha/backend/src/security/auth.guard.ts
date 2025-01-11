import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '$user/user.service';
import { LocationIPService } from '$app/location/locationIp.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException('You must be logged in');
		}
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('secretJWT'),
			});
			request['user'] = await this.userService.getByPK(payload.id);
		} catch {
			throw new UnauthorizedException('Are you a hacker?');
		}
		if (!request['user'].isValidateEmail()) {
			throw new UnauthorizedException('Your email must be validated');
		}
		const ip = request.connection.remoteAddress;
		await AuthGuard.updateIpLocation(ip, request['user']);
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		return AuthGuard.extractTokenFromHeader(request);
	}

	static async ipIsLocal(ip: string): Promise<boolean> {
		const localPrefix = ['10', '172', '192'];
		if (ip == '127.0.0.1') return true;
		for await (const preffix of localPrefix) {
			if (ip.slice(0, preffix.length) == preffix) {
				return true;
			}
		}
		return false;
	}

	private static async requiredUpdateIPLocation(
		user: UserService,
	): Promise<boolean> {
		if (user.getLocationType() != 'IP') {
			Logger.log(
				'Not update location IP Location Type in not set in IP',
				'AuthGuard',
			);
			return false;
		}
		const locationIPService = new LocationIPService();
		let location: LocationIPService;
		try {
			location = await locationIPService.findLocationByUser(user);
		} catch (err) {
			Logger.error(err, 'AuthGuard');
			return true;
		}
		const updated = location.getUpdatedAt();
		const currentDate = new Date();
		const diff = Math.abs(currentDate.getTime() - updated.getTime());

		if (diff >= 1000 * 60 * 5) {
			Logger.log('Update Location IP', 'AuthGuard');
			return true;
		}
		Logger.log('Not required update Location IP', 'AuthGuard');
		return false;
	}

	static async updateIpLocation(
		ip: string,
		user: UserService,
	): Promise<void> {
		let publicIp = ip;
		if (!(await this.requiredUpdateIPLocation(user))) {
			return;
		}
		if (typeof publicIp != 'string' || publicIp.length < 8) {
			throw new Error(`This '${publicIp}' is not IP`);
		}
		if (this.ipIsLocal(ip)) {
			try {
				publicIp = await fetch('https://api.ipify.org?format=json', {
					method: 'GET',
				})
					.then(async (r) => (await r.json())['ip'])
					.catch((e) => {
						throw new Error(e);
					});
			} catch (err) {
				Logger.error(err, 'AuthGuard');
				return;
			}
		}
		try {
			const values: { lat: number; lon: number } = await fetch(
				'http://ip-api.com/batch',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'Application/json',
					},
					body: JSON.stringify([
						{
							query: publicIp,
						},
					]),
				},
			)
				.then(async (res) => (await res.json())[0])
				.catch((err) => err);
			await user.setLocationIp(values.lat, values.lon);
		} catch (err) {
			Logger.error(err, 'AuthGuard');
			return;
		}
	}

	static extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}

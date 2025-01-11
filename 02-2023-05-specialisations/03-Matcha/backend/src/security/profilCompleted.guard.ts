import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '$user/user.service';
import { AuthGuard } from './auth.guard';

@Injectable()
export class ProfilCompletedGuard implements CanActivate {
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
		let user: UserService;
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('secretJWT'),
			});
			user = await this.userService.getByPK(payload.id);
		} catch {
			throw new UnauthorizedException('Are you a hacker?');
		}
		if (!user.isValidateEmail()) {
			throw new UnauthorizedException('Your email must be validated');
		}
		if (!(await user.isComplete())) {
			throw new UnauthorizedException('Your profil is not complete');
		}
		request['user'] = user;
		const ip = request.connection.remoteAddress;
		await AuthGuard.updateIpLocation(ip, request['user']);
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		return AuthGuard.extractTokenFromHeader(request);
	}
}

import {
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '$user/user.service';
import { IJWT } from './auth.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly loggerService: Logger,
	) {}

	async signIn(username: string, password: string): Promise<IJWT> {
		try {
			const user = await this.userService.getByUsername(username);
			if (!user.compare(password)) {
				throw new UnauthorizedException(
					'Incorrect password or username',
				);
			}
			return await this.getJwt(user);
		} catch (e) {
			this.loggerService.error(e, 'AuthService');
			throw new UnauthorizedException('Incorrect password or username');
		}
	}

	async getJwt(user: UserService): Promise<IJWT> {
		if (user.getId() == undefined) throw new NotFoundException();
		const payload = { id: user.getId() };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}

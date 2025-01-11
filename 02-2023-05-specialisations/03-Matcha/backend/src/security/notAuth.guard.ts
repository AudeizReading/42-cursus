import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';

@Injectable()
export class NotAuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (token) {
			throw new UnauthorizedException(
				'You cannot perform this action if you are logged in',
			);
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		return AuthGuard.extractTokenFromHeader(request);
	}
}

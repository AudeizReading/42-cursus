import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class FileMiddleware implements NestMiddleware {
	private fileProfileCounts = new Map<string, boolean>();
	private requestQueue = new Map<string, (() => void)[]>();

	private async fileProfile(
		authorization: string,
		res: Response,
	): Promise<void> {
		if (!authorization) return;
		if (this.fileProfileCounts.get(authorization) == undefined) {
			this.fileProfileCounts.set(authorization, false);
		}
		if (this.fileProfileCounts.get(authorization)) {
			await new Promise<void>((resolve) => {
				if (!this.requestQueue.has(authorization)) {
					this.requestQueue.set(authorization, []);
				}
				this.requestQueue.get(authorization).push(resolve);
			});
		} else {
			this.fileProfileCounts.set(authorization, true);
		}
		res.on('finish', () => {
			this.fileProfileCounts.set(authorization, false);
			const nextRequest = this.requestQueue.get(authorization)?.shift();
			if (nextRequest) {
				nextRequest();
			}
		});
	}

	async use(req: Request, res: Response, next: () => void): Promise<void> {
		const authorization = req.headers.authorization;

		await this.fileProfile(authorization, res);
		next();
	}
}

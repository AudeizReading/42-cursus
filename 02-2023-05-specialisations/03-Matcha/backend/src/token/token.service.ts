import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { UserService } from '$user/user.service';
import { IDatabaseToken, IToken, Reason, reasons } from './token.interface';
import { ADatabaseRelationUser } from '$database/ADatabaseRelationUser';

@Injectable()
export class TokenService extends ADatabaseRelationUser<
	IDatabaseToken,
	TokenService,
	IToken
> {
	normalize(): IToken {
		const { id, reason, token, expired, userId } = this;
		return { id, reason, token, expired, userId };
	}
	private reason: Reason;
	private token: string;
	private expired = false;

	constructor() {
		super(TokenService, 'token');
		this.userService = new UserService();
	}

	static generateUUID(): string {
		return uuid.v4();
	}

	async new(reason: Reason, user: UserService): Promise<TokenService> {
		if (reason == undefined) throw new Error('Reason is not define');
		const token = new TokenService();
		token.setReason(reason);
		token.setUserId(user.getId());
		token.setToken(TokenService.generateUUID());
		await token.update();
		return token;
	}

	async getByToken(token: string): Promise<TokenService> {
		const tokens = await this.get(token, 'token');
		if (tokens.length != 1) {
			throw new Error(`${tokens.length} token`);
		}
		return tokens[0] as TokenService;
	}

	deserialize(database: IDatabaseToken): void {
		this.setId(database.id);
		this.setReason(database.reason as Reason);
		this.setToken(database.token);
		this.setExpired(
			database.expired == 1
				? true
				: database.expired == 0
					? false
					: undefined,
		);
		this.setUserId(database.userId);
	}

	setReason(reason: Reason): void {
		if (reasons.find((r) => r == reason) == undefined)
			throw new Error(`'${reason}' is not a Reason`);
		this.reason = reason;
	}

	getReason(): Reason {
		return this.reason;
	}

	isReason(reason: Reason): boolean {
		return this.getReason() == reason;
	}

	setToken(token: string): void {
		if (token == undefined) throw new Error(`'${token}' is not a Token`);
		this.token = token;
	}

	getToken(): string {
		return this.token;
	}

	setExpired(expired: boolean): void {
		if (typeof expired != 'boolean')
			throw new Error(`'${expired}' is not boolean`);
		this.expired = expired;
	}

	isExpired(): boolean {
		return this.expired;
	}
}

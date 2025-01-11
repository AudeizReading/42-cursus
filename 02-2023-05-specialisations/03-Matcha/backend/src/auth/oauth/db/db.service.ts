import { ADatabaseRelationUser } from '$app/database/ADatabaseRelationUser';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IDatabaseOauth, IOauth, Provider } from './db.interface';
import { UserService } from '$app/user/user.service';
import { Oauth } from './db.schema';

@Injectable()
export class DbService extends ADatabaseRelationUser<
	IDatabaseOauth,
	DbService,
	IOauth
> {
	private id_oauth: string;
	private provider: Provider;
	private access_token: string;
	private expires_in: Date;

	constructor() {
		super(DbService, 'oauth');
		this.userService = new UserService();
	}

	setIdOauth(id_oauth: string): void {
		this.id_oauth = id_oauth;
	}

	setProvider(provider: Provider): void {
		this.provider = provider;
	}

	getProvider(): string {
		return this.provider;
	}

	setAccessToken(token: string): void {
		this.access_token = token;
	}

	getAccessToken(): string {
		return this.access_token;
	}

	getTokenType(): string {
		return 'Bearer';
	}

	setExpiresIn(expires_in: number): void {
		this.expires_in = new Date(expires_in);
	}

	getExpiresIn(): number {
		return this.expires_in.getTime();
	}

	isExpired(): boolean {
		return new Date().getTime() >= this.expires_in.getTime();
	}

	deserialize(db: IDatabaseOauth): void {
		this.setId(db.id);
		this.setIdOauth(db.id_oauth);
		if (db.userId) this.setUserId(db.userId);
		this.setAccessToken(db.access_token);
		this.setProvider(db.provider);
		this.setExpiresIn(db.expires_in);
	}
	normalize(): IOauth {
		const { id, id_oauth, userId, provider, access_token, expires_in } =
			this;
		return { id, id_oauth, userId, provider, access_token, expires_in };
	}

	async newOauth(
		idOauth: string,
		access_token: string,
		provider: Provider,
		expires_in: number,
	): Promise<DbService> {
		try {
			this.setIdOauth(idOauth);
			this.setAccessToken(access_token);
			this.setProvider(provider);
			this.setExpiresIn(expires_in);
			await this.update();
			return this;
		} catch {
			const oauth = await this.getByOauthId(idOauth);
			oauth.setAccessToken(access_token);
			oauth.setExpiresIn(expires_in);
			await oauth.update();
			return oauth;
		}
	}

	async getOauth(user: UserService): Promise<Oauth[]> {
		const oauth = await this.get(user.getId(), 'userId');
		return oauth.map((o) => {
			const { id, id_oauth, provider } = o;
			return {
				id,
				id_provider: id_oauth,
				provider,
			} as unknown as Oauth;
		});
	}

	async getByOauthId(oauthId: string): Promise<DbService> {
		const tmp = this.newInstance();
		const oauth = await tmp.get(oauthId, 'id_oauth');
		if (oauth.length != 1) {
			throw new NotFoundException();
		}
		return oauth[0];
	}

	unlinkIdUser(): void {
		this.userId = null;
	}
}

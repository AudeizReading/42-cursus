import { UserService } from '$user/user.service';
import { ADatabase } from './ADatabase';

export abstract class ADatabaseRelationUser<
	DB_INTERFACE,
	SERVICE,
	SERVICE_INTERFACE,
> extends ADatabase<DB_INTERFACE, SERVICE, SERVICE_INTERFACE> {
	protected userId: number;
	protected userService: UserService;

	constructor(
		instance: new () => SERVICE,
		tableName: string,
		forbiddenTag: string[] = [],
	) {
		super(instance, tableName, [...forbiddenTag, 'userService']);
	}

	setUserId(userId: number): void {
		if (typeof userId != 'number' || userId <= 0)
			throw new Error(`'${userId}' is not valid UserID`);
		this.userId = userId;
	}

	getUserId(): number {
		return this.userId;
	}

	setUser(user: UserService): void {
		this.setUserId(user.getId());
	}

	async getUser(): Promise<UserService> {
		return await this.userService.getByPK(this.getUserId());
	}
}

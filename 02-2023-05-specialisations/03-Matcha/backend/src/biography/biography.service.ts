import { Injectable } from '@nestjs/common';
import { IBiography, IDatabaseBiography } from './biography.interface';
import { ADatabaseRelationUser } from '$database/ADatabaseRelationUser';
import { UserService } from '$user/user.service';

@Injectable()
export class BiographyService extends ADatabaseRelationUser<
	IDatabaseBiography,
	BiographyService,
	IBiography
> {
	normalize(): IBiography {
		const { id, description, userId } = this;
		return { id, description, userId };
	}
	private description: string;

	constructor() {
		super(BiographyService, 'biography');
		this.userService = new UserService();
	}

	setDescription(description: string): void {
		this.description = description;
	}

	getDescription(): string {
		return this.description;
	}

	deserialize(db: IDatabaseBiography): void {
		this.setId(db.id);
		this.setDescription(db.description);
		this.setUserId(db.userId);
	}

	async recover(user: UserService): Promise<void> {
		this.setUser(user);
		const tmp = await this.get(user.getId(), 'userId');
		if (tmp.length != 1) throw new Error('Recover is not possible');
		this.setDescription(tmp[0].getDescription());
		this.setId(tmp[0].getId());
	}
}

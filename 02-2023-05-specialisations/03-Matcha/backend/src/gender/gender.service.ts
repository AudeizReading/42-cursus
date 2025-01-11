import { Injectable } from '@nestjs/common';
import { Gender, IDatabaseGender, IGender, genders } from './gender.interface';
import { ADatabaseRelationUser } from '$database/ADatabaseRelationUser';
import { UserService } from '$user/user.service';

@Injectable()
export class GenderService extends ADatabaseRelationUser<
	IDatabaseGender,
	GenderService,
	IGender
> {
	private gender: Gender;

	constructor() {
		super(GenderService, 'gender');
		this.userService = new UserService();
	}

	setGender(gender: Gender): void {
		if (!genders.includes(gender))
			throw new Error(`'${gender}' is invalid Gender`);
		this.gender = gender;
	}

	getGender(): Gender {
		return this.gender;
	}

	normalize(): IGender {
		const { id, gender, userId } = this;
		return { id, gender, userId };
	}

	deserialize(db: IDatabaseGender): void {
		this.setId(db.id);
		this.setGender(db.gender as Gender);
		this.setUserId(db.userId);
	}

	getGenderType(): Gender[] {
		return genders;
	}

	async recover(user: UserService): Promise<void> {
		this.setUser(user);
		const tmp = await this.get(user.getId(), 'userId');
		if (tmp.length != 1) throw new Error('Recover is not possible');
		this.setGender(tmp[0].getGender());
		this.setId(tmp[0].getId());
	}
}

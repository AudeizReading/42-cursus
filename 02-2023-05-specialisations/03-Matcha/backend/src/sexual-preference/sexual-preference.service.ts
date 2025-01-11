import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
	IDatabaseSexualPreference,
	ISexualPreference,
	Preference,
	preferences,
} from './sexual-preference.interface';
import { ADatabaseRelationUser } from '$database/ADatabaseRelationUser';
import { UserService } from '$user/user.service';

@Injectable()
export class SexualPreferenceService extends ADatabaseRelationUser<
	IDatabaseSexualPreference,
	SexualPreferenceService,
	ISexualPreference
> {
	private preference: Preference;

	constructor() {
		super(SexualPreferenceService, 'sexualPreference');
		this.userService = new UserService();
	}

	setPreference(preference: Preference): void {
		if (!preferences.includes(preference))
			throw new Error(`${preference} is not preference`);
		this.preference = preference;
	}

	getPreference(): Preference {
		return this.preference;
	}

	normalize(): ISexualPreference {
		const { id, preference, userId } = this;
		return { id, preference, userId };
	}

	deserialize(db: IDatabaseSexualPreference): void {
		this.setId(db.id);
		this.setPreference(db.preference as Preference);
		this.setUserId(db.userId);
	}

	async getPreferences(user: UserService): Promise<Preference[]> {
		const gender = await user.getGender();
		switch (gender.gender) {
			case 'Man':
				return ['Gay', 'Bisexual', 'Hetero'];
			case 'Woman':
				return ['Lesbian', 'Bisexual', 'Hetero'];
			default:
				throw new UnauthorizedException('Gender is not good');
		}
	}

	async recover(user: UserService): Promise<void> {
		this.setUser(user);
		const tmp = await this.get(user.getId(), 'userId');
		if (tmp.length != 1) throw new Error('Recover is not possible');
		this.setPreference(tmp[0].getPreference());
		this.setId(tmp[0].getId());
	}
}

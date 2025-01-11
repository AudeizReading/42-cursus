import { DestroyRef, inject } from '@angular/core';
import { Gender, ProfileGenderFacade } from '.';
import { AlertService, GenderService, SexualPreferenceService, UserService } from '@app/shared';
import { map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface SexualPreferenceDTO {
	sexualPreference: string;
}

export interface SexualPreferencesDTO {
	preference: string[];
}

export function sexualPreferencesDTOToGender(sexualPreferencesDTO: SexualPreferencesDTO): string[] {
	return Array.from(sexualPreferencesDTO.preference) as string[];
}

export class ProfileSexualityFacade extends ProfileGenderFacade {
	protected sexualityList: SexualPreferencesDTO[] & string[] = [];
	private s_destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		alertService: AlertService,
		genderService: GenderService,
		private sexualPreferenceService: SexualPreferenceService,
		userService: UserService,
	) {
		super(alertService, genderService, userService);
	}

	protected setSexualitiesList(): Observable<SexualPreferencesDTO> {
		return this.sexualPreferenceService.getSexualPreferences().pipe(
			takeUntilDestroyed(this.s_destroyRef),
			map((details) => {
				this.sexualityList = sexualPreferencesDTOToGender(
					details as SexualPreferencesDTO,
				) as SexualPreferencesDTO[] & string[];
				return details as SexualPreferencesDTO;
			}),
		);
	}

	protected get availableSexualities(): SexualPreferencesDTO[] {
		return this.sexualityList.filter((data) => typeof data !== 'string');
	}

	protected get sexualities(): SexualPreferencesDTO[] & string[] {
		return this.sexualityList;
	}

	protected updateSexuality(sexuality: Gender): Observable<unknown> {
		return this.userService.updateGender(sexuality);
	}
}

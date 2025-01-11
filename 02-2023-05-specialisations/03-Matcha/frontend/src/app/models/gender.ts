import { DestroyRef, inject } from '@angular/core';
import { AlertFacade } from '.';
import { AlertService, GenderService, UserService } from '@app/shared';
import { map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type Gender = 'Man' | 'Woman';

export interface GendersDTO {
	genders: Gender & string[];
}

export function gendersDTOToGender(gendersDTO: GendersDTO): Gender[] {
	return Array.from(gendersDTO.genders) as Gender[];
}

export class ProfileGenderFacade extends AlertFacade {
	protected genderList: Gender[] & string[] = [];
	private g_destroyRef: DestroyRef = inject(DestroyRef);

	public constructor(
		alertService: AlertService,
		private genderService: GenderService,
		protected userService: UserService,
	) {
		super(alertService);
	}

	protected setGendersList(): Observable<GendersDTO> {
		return this.genderService.getGenders().pipe(
			takeUntilDestroyed(this.g_destroyRef),
			map((genders) => {
				this.genderList = gendersDTOToGender(genders as GendersDTO);
				return genders as GendersDTO;
			}),
		);
	}

	protected get availableGenders(): Gender[] {
		return this.genderList.filter((data) => typeof data !== 'string');
	}

	protected get genders(): Gender[] & string[] {
		return this.genderList;
	}

	protected updateGender(gender: Gender): Observable<unknown> {
		return this.userService.updateGender(gender);
	}
}

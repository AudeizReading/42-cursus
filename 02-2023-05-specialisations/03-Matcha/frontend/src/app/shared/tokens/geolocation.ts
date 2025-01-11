import { inject, InjectionToken } from '@angular/core';
import { NAVIGATOR } from './navigator';

export const GEOLOCATION = new InjectionToken<Geolocation>(
	'[GEOLOCATION]: an abstraction over global window.navigator.geolocation object',
	{
		factory: (): Geolocation => inject(NAVIGATOR).geolocation,
	},
);

export const GEOLOCATION_SUPPORT = new InjectionToken<boolean>(
	'[GEOLOCATION_SUPPORT]: a boolean indicating geolocation support',
	{
		factory: (): boolean => !!inject(GEOLOCATION),
	},
);

export const POSITION_OPTIONS = new InjectionToken<PositionOptions>('Token for an additional position options', {
	factory: (): object => ({}),
});

export const PERMISSIONS = new InjectionToken<Permissions>(
	'[PERMISSIONS]: an abstraction over global window.navigator.permissions object',
	{
		factory: (): Permissions => inject(NAVIGATOR).permissions,
	},
);

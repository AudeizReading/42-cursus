import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window';

export const NAVIGATOR = new InjectionToken<Navigator>(
	'[NAVIGATOR]: an abstraction over global window.navigator object',
	{
		factory: (): Navigator => inject(WINDOW).navigator as Navigator,
	},
);

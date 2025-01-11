import { DOCUMENT } from '@angular/common';

import { inject, InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('[WINDOW]: an abstraction over global window object', {
	factory: (): Window => inject(DOCUMENT).defaultView as Window,
});

export const WINDOW_SUPPORT = new InjectionToken<boolean>(
	'[WINDOW_SUPPORT]: a boolean indicating geolocation support',
	{
		factory: (): boolean => !!inject(WINDOW),
	},
);

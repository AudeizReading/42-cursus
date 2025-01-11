import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { routes as profileRoutes } from './pages/profile/profile.routes';
import { routes as chatRoutes } from './pages/chat/chat.routes';
import { httpInterceptorProviders, loggingInterceptorProviders } from '@app/shared';
import {
	BrowserAnimationsModule,
	provideAnimations,
	provideNoopAnimations,
} from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(
			routes,
			withComponentInputBinding(),
			withRouterConfig({ paramsInheritanceStrategy: 'always' }),
			withInMemoryScrolling({
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'enabled',
			}),
		),
		provideRouter(
			profileRoutes,
			withComponentInputBinding(),
			withRouterConfig({ paramsInheritanceStrategy: 'always' }),
			withInMemoryScrolling({
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'enabled',
			}),
		),
		provideRouter(
			chatRoutes,
			withComponentInputBinding(),
			withRouterConfig({ paramsInheritanceStrategy: 'always' }),
			withInMemoryScrolling({
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'enabled',
			}),
		),
		provideClientHydration(),
		provideHttpClient(withFetch(), withInterceptorsFromDi()),
		provideAnimations(),
		provideNoopAnimations(),
		BrowserAnimationsModule,
		httpInterceptorProviders,
		loggingInterceptorProviders,
		provideAnimationsAsync(),
	],
};

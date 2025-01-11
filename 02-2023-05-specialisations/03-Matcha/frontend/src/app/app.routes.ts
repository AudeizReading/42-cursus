import { Routes } from '@angular/router';
import { authGuard, errorGuard, notAuthGuard, profileGuard } from '@app/shared';

export const routes: Routes = [
	{
		path: 'registration',
		title: 'Registration',
		loadComponent: () => import('./pages').then((m) => m.RegistrationComponent),
		canActivate: [notAuthGuard],
	},
	{
		path: '',
		title: 'Home',
		loadComponent: () => import('./pages').then((m) => m.HomeComponent),
	},
	{
		path: 'email/validate/:token',
		title: 'Email Validation',
		loadComponent: () => import('./pages').then((m) => m.EmailValidationComponent),
	},
	{
		path: 'user/changePasswordByToken/:token',
		title: 'Password Validation',
		loadComponent: () => import('./pages').then((m) => m.PasswordValidationComponent),
	},
	{
		path: 'recovery/password',
		title: 'Password Recovery',
		loadComponent: () => import('./pages').then((m) => m.RecoveryComponent),
	},
	{
		path: 'profile',
		title: 'Profile',
		loadChildren: () => import('./pages/profile/profile.routes').then((m) => m.routes),
		canActivate: [authGuard],
	},
	{
		path: 'error',
		title: 'Error',
		loadComponent: () => import('./pages').then((m) => m.ErrorComponent),
	},
	{
		path: 'browsing',
		title: 'Browsing',
		loadComponent: () => import('./pages').then((m) => m.BrowsingComponent),
		canActivate: [authGuard, profileGuard],
	},
	{
		path: 'research',
		title: 'Research',
		loadComponent: () => import('./pages').then((m) => m.ResearchComponent),
		canActivate: [authGuard, profileGuard],
	},
	{
		path: 'chat',
		title: 'Chat',
		loadChildren: () => import('./pages/chat/chat.routes').then((m) => m.routes),
		canActivate: [authGuard, profileGuard],
	},
	{
		path: 'event',
		title: 'Event',
		loadComponent: () => import('./pages').then((m) => m.EventComponent),
		canActivate: [authGuard, profileGuard],
	},
	{
		path: '**',
		pathMatch: 'full',
		title: 'Error',
		loadComponent: () => import('./pages').then((m) => m.ErrorComponent),
		canActivate: [errorGuard],
	},
];

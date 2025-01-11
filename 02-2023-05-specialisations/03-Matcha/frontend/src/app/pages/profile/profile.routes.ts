import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { profileGuard } from '@app/shared';

export const routes: Routes = [
	{
		path: '',
		redirectTo: '/profile/me',
		pathMatch: 'full',
	},
	{
		path: 'registration',
		title: 'Profile Registration',
		loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
	},
	{
		path: 'me',
		title: 'My Profile',
		loadComponent: () => import('./profile.component').then((m) => m.ProfileComponent),
		canActivate: [profileGuard],
	},
	{
		path: 'settings',
		title: 'Profile Settings',
		loadComponent: () => import('./update-profile/update-profile.component').then((m) => m.UpdateProfileComponent),
		canActivate: [profileGuard],
	},
	{
		matcher: (url: UrlSegment[]): UrlMatchResult | null => {
			const path = url[0]?.path || null;
			if (!path) {
				return null;
			}
			const isNumber = /^\d+$/.test(path);
			return isNumber ? { consumed: [url[0]], posParams: { id: url[0] } } : null;
		},
		title: 'Profile',
		loadComponent: () => import('./profile.component').then((m) => m.ProfileComponent),
		canActivate: [profileGuard],
	},
];

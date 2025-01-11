import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { authGuard, chatGuard, profileGuard } from '@app/shared';

export const routes: Routes = [
	{
		path: '',
		title: 'Chat',
		loadComponent: () => import('./chat.component').then((m) => m.ChatComponent),
		canActivate: [authGuard, profileGuard],
	},
	{
		matcher: (url: UrlSegment[]): UrlMatchResult | null => {
			const path = url[0]?.path || null;
			if (!path || path !== 'conversation') {
				return null;
			}
			const uuid = url[1]?.path || null;
			const isUuid = /^\d+$/.test(uuid ?? '');
			return isUuid ? { consumed: [url[0], url[1]], posParams: { correspondantId: url[1] } } : null;
		},
		title: 'Chat conversation',
		loadComponent: () => import('./conversation/conversation.component').then((m) => m.ConversationComponent),
		canActivate: [authGuard, profileGuard, chatGuard],
	},
];

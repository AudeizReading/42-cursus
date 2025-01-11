import { UserService } from '$user/user.service';

export type Context = 'PROFIL' | 'CHAT' | 'EVENT';
export const contexts: Context[] = ['PROFIL', 'CHAT', 'EVENT'];
export type Type = 'PICTURE' | 'VIDEO' | 'AUDIO';

interface IFileType<C, T> {
	id: number;
	name: string;
	originalName: string;
	context: C;
	type: T;
	duration?: number;
	width?: number;
	height?: number;
	size: number;
}

export type IDatabaseFile = IFileType<string, string>;

export interface IFile extends IFileType<Context, Type> {
	url: string;
}

export interface IFileRequest {
	user: UserService;
}

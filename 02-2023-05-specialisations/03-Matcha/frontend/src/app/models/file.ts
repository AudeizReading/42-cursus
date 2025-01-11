export interface FileDTO {
	id: number;
	url: string;
	name: string;
	originalName: string;
	context: FileContext;
	type: FileType;
	duration: number;
	width: number;
	height: number;
	size: number;
}

export class FilePreview {
	public readonly name!: string;
	public readonly url!: string;
	public readonly backUrl!: string;
	public readonly id!: number;
	public readonly preview!: string | ArrayBuffer | null;
	public readonly size!: number;
	public readonly type!: string;

	public constructor(init?: Partial<FilePreview>) {
		Object.assign(this, init);
	}
}

export type FileContext = 'PROFIL' | 'CHAT' | 'EVENT';
export type FileType = 'PICTURE' | 'VIDEO' | 'AUDIO';

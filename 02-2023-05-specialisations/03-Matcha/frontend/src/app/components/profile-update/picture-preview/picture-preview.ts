export type PicturePreviewRole = 'main' | 'aux';
export type PicturePreviewActionType = 'choose' | 'delete' | 'placeholder';

export interface PicturePreviewConfig {
	url: string;
	role: PicturePreviewRole;
	id?: number;
	name?: string;
}

export interface PicturePreviewAction {
	action: PicturePreviewActionType;
	config: PicturePreviewConfig;
}

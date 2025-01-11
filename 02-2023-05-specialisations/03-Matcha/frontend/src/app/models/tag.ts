import { ApiBody, ApiQuery } from './api';

export interface ITag {
	id: number;
	name: string;
}

export class Tag {
	public id: number;
	public name: string;
	public canDelete: boolean;
	public canAdd: boolean;
	public canUpdate: boolean;

	public constructor(tag: Partial<Tag>) {
		this.id = tag.id || -1;
		this.name = tag.name || '';
		this.canDelete = tag.canDelete || false;
		this.canAdd = tag.canAdd || false;
		this.canUpdate = tag.canUpdate || false;
	}

	public update(tag: Partial<Tag>): void {
		Object.assign(this, tag);
	}
}

export interface TagDTO {
	message: string;
	tag: ITag;
}
export interface TagsDTO {
	currentPage: number;
	limit: number;
	results: ITag[];
	totalPages: number;
}

export interface TagQueryDTO extends ApiQuery {
	limit?: number;
	page?: number;
	search?: string;
}

export interface TagBodyDTO extends ApiBody {
	tag: string;
}

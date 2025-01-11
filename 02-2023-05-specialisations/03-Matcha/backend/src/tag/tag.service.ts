import { Injectable } from '@nestjs/common';
import { ADatabase } from '$database/ADatabase';
import { IDatabaseTag, ITag } from './tag.interface';
import { GetTagQuery, GetTagReturn } from './tag.schema';

@Injectable()
export class TagService extends ADatabase<IDatabaseTag, TagService, ITag> {
	private name: string;

	constructor() {
		super(TagService, 'tag');
	}

	static validTagName(tagName: string): boolean {
		if (tagName == undefined) return false;
		return /^[a-zA-Z0-9]{3,}$/i.test(tagName);
	}

	setName(name: string): void {
		if (!TagService.validTagName(name)) {
			throw new Error(`TagName is invalide '${name}'`);
		}
		this.name = name;
	}

	getName(): string {
		if (this.name == undefined) throw new Error('Name is undefined');
		return this.name;
	}

	deserialize(db: IDatabaseTag): void {
		this.setId(db.id);
		this.setName(db.name);
	}

	async getByName(name: string): Promise<TagService> {
		const tags = await this.get(name, 'name');
		if (tags.length != 1) {
			throw new Error(`${tags.length} tags`);
		}
		return tags[0] as TagService;
	}

	normalize(): ITag {
		const { id, name } = this;
		return { id, name };
	}

	async search(params: GetTagQuery): Promise<GetTagReturn> {
		const r = await this.searchInSql(
			params.limit,
			params.page,
			params.search,
			'name',
		);
		return {
			results: r.results.map((v) => v.normalize()),
			limit: params.limit,
			currentPage: params.page,
			totalPage: r.totalPage,
		};
	}
}

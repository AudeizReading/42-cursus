import { TagService } from '$app/tag/tag.service';

export class TagTest {
	static counter = 0;

	static get tagName(): string {
		const tagName = `tag${this.counter}`;
		this.counter++;
		return tagName;
	}
}

export const createTag = async (
	service: TagService,
	tagName: string,
): Promise<TagService> => {
	let tag: TagService;
	try {
		tag = service.newInstance();
		tag.setName(tagName);
		await tag.update();
		return tag;
	} catch (error) {
		throw new Error(`Error creating tag: ${error}`);
	}
};

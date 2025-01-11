import { UserService } from '$user/user.service';

interface ITagType {
	id: number;
	name: string;
}

export type ITag = ITagType;
export type IDatabaseTag = ITagType;

export interface ITagRequest {
	user: UserService;
}

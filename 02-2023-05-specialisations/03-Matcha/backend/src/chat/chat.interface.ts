interface IChatType<T> {
	id: number;
	sendId: number;
	receiveId: number;
	message?: string;
	fileId?: number;
	read: T;
}

export type IDatabaseChat = IChatType<number>;
export type IChat = IChatType<boolean>;

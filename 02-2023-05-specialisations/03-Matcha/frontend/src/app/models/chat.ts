import { ApiBody, ApiQuery } from './api';
import { FileContext, FileType } from './file';
import { ProfileDTO } from './profile';

export interface ChatMediaAction {
	action: string;
	uploader?: File;
}

export interface ChatSendMessageAPIBodyDTO extends ApiBody {
	message: string;
	userId: number;
}

export interface ChatConversationAPIQueryDTO extends ApiQuery {
	limit: number;
	maxId?: number;
}

export interface ChatReadMessageAPIQueryDTO extends ApiQuery {
	limit: number;
	page: number;
	messageId: number;
}

export interface ChatMediaAPIBodyDTO {
	file: File;
	userId: number;
}

export interface ChatMediaAPIResponseDTO {
	id: number;
	url: 'string';
	name: 'string';
	originalName: 'string';
	context: FileContext;
	type: FileType;
	duration: number;
	width: number;
	height: number;
	size: number;
}

export interface ChatSendMessageAPIResponseDTO {
	status: boolean;
}

export interface ChatConversationAPIResponseDTO {
	id: number;
	sender?: ProfileDTO;
	receiver?: ProfileDTO;
	message: string;
	file?: ChatMediaAPIResponseDTO;
	read: boolean;
}

export class ChatMessage implements ChatConversationAPIResponseDTO {
	public id: number;
	public sender?: ProfileDTO;
	public receiver?: ProfileDTO;
	public message: string;
	public file?: ChatMediaAPIResponseDTO;
	public read: boolean;

	public constructor(datas: Partial<ChatConversationAPIResponseDTO>) {
		this.id = datas.id!;
		this.sender = datas.sender;
		this.receiver = datas.receiver;
		this.message = datas.message!;
		this.file = datas.file;
		this.read = datas.read!;
	}
}

export interface TyppingState {
	isTypping: boolean;
	userId: number;
}

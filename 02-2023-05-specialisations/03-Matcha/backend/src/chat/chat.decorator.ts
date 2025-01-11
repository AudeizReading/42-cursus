import { ApiOperation } from '@nestjs/swagger';
import { ApiOkResponse } from '$app/app.decorator';
import { SendMessageRto, UnreadMessageDto } from '$app/socket/socket.schema';
import { Message } from './chat.schema';

type Route = 'sendMessage' | 'getMessage' | 'readMessage' | 'unreadMessage';

const sendMessage = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Send message chat with API'].join(''),
		description: ['Send message chat with API'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: SendMessageRto })(target, propertyKey, descriptor);
};

const getMessage = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get message conversation'].join(''),
		description: ['Get message conversation with User'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: [Message] })(target, propertyKey, descriptor);
};

const readMessage = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Set read message'].join(''),
		description: ['Set read message'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const unreadMessage = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get number unread message'].join(''),
		description: ['Get number unread message'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: UnreadMessageDto })(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'sendMessage':
			return sendMessage;
		case 'getMessage':
			return getMessage;
		case 'readMessage':
			return readMessage;
		case 'unreadMessage':
			return unreadMessage;
	}
};

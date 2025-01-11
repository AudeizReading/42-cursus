import { ApiOperation } from '@nestjs/swagger';
import { ApiOkResponse, ApiNotFoundResponse } from '$app/app.decorator';
import { Notification, UnreadNotification } from './notification.schema';

type Route =
	| 'deleteNotification'
	| 'readNotification'
	| 'getNumberUnreadNotification'
	| 'getNotifications';

const deleteNotification = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Delete a Notification'].join(''),
		description: ['Delete a Notification'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const getNotification = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Return notification user'].join(''),
		description: ['Return notification user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: [Notification] })(target, propertyKey, descriptor);
};

const getNumberUnreadNotification = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get number unread notifications'].join(''),
		description: ['Get number unread notifications'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: UnreadNotification })(
		target,
		propertyKey,
		descriptor,
	);
};

const readNotification = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Read a notification'].join(''),
		description: ['Read a notification'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'deleteNotification':
			return deleteNotification;
		case 'getNotifications':
			return getNotification;
		case 'getNumberUnreadNotification':
			return getNumberUnreadNotification;
		case 'readNotification':
			return readNotification;
	}
};

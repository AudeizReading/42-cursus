import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { ApiOkResponse } from '$app/app.decorator';
import { OkGetEvent } from './event.schema';
import { Event } from './event.schema';

type Route = 'newEvent' | 'acceptEvent' | 'refuseEvent' | 'getEvent';

const getEvent = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get event'].join(''),
		description: ['Get event'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkGetEvent })(target, propertyKey, descriptor);
};

const newEvent = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Create new event'].join(''),
		description: ['Create new event'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: Event })(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const acceptRefuseEvent = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Accept refuse event'].join(''),
		description: ['Accept refuse event'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: Event })(target, propertyKey, descriptor);
	ApiConflictResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'acceptEvent':
			return acceptRefuseEvent;
		case 'refuseEvent':
			return acceptRefuseEvent;
		case 'getEvent':
			return getEvent;
		case 'newEvent':
			return newEvent;
	}
};

import { ApiOperation } from '@nestjs/swagger';
import { ApiBadRequestResponse, ApiOkResponse } from '$app/app.decorator';
import { Address } from './location.schema';

type Route = 'setFake' | 'setNavigator' | 'getAddress';

const setFake = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Set fake location'].join(''),
		description: ['Set fake location'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const setNavigator = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Set navigator location'].join(''),
		description: ['Set navigator location'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const getAddress = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get address by location'].join(''),
		description: ['Get address by location'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: Address })(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'setFake':
			return setFake;
		case 'setNavigator':
			return setNavigator;
		case 'getAddress':
			return getAddress;
	}
};

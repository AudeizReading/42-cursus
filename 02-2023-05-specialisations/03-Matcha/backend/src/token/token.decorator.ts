import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { TokenExpired } from './token.schema';
import { ApiBadRequestResponse } from '$app/app.decorator';

type Route = 'getTokenExpired';

const getTokenExpired = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get if token is expired'].join(''),
		description: [
			'This endpoint check is token is expired before using',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
	ApiOkResponse({ type: TokenExpired })(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'getTokenExpired':
			return getTokenExpired;
	}
};

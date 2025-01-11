import { ApiOkResponse } from '$app/app.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { OkResponsGetPreferences } from './sexual-preference.schema';
type Route = 'getPreferences';

const getPreferences = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Return preference sexual for current user'].join(''),
		description: [
			'This route returns the sexual preferences that the ',
			'currently logged-in user can set.',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponsGetPreferences })(
		target,
		propertyKey,
		descriptor,
	);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'getPreferences':
			return getPreferences;
	}
};

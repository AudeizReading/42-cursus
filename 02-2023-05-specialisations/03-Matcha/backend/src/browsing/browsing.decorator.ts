import { ApiOkResponse } from '$app/app.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { OkResponseBrowsing } from './browsing.schema';

type Route = 'browsing' | 'search';

const browsing = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Return browsing list user'].join(''),
		description: ['Return browsing list user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseBrowsing })(
		target,
		propertyKey,
		descriptor,
	);
};

const search = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Return search list user'].join(''),
		description: ['Return search list user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseBrowsing })(
		target,
		propertyKey,
		descriptor,
	);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'browsing':
			return browsing;
		case 'search':
			return search;
	}
};

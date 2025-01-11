import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { OkResponseGetBlock } from './block.scheme';

type Route = 'getBlockedUser';

const getBlockedUser = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Return blocked list user'].join(''),
		description: ['Return blocked list user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseGetBlock })(
		target,
		propertyKey,
		descriptor,
	);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'getBlockedUser':
			return getBlockedUser;
	}
};

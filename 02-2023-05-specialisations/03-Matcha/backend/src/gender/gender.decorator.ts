import { ApiOperation } from '@nestjs/swagger';
import { ApiOkResponse } from '$app/app.decorator';
import { OkResponseGetGenders } from './gender.schema';

type Route = 'getGenders';

const getGenders = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['all genders disponible'].join(''),
		description: ['This route return all genders disponible'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseGetGenders })(
		target,
		propertyKey,
		descriptor,
	);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'getGenders':
			return getGenders;
	}
};

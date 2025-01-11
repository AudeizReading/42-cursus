import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
	RegistrationBadRequestResponse,
	RegistrationUserBody,
	RegistrationUserCreatedResponse,
} from './registration.schema';
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiCreatedResponse,
} from '$app/app.decorator';

type Route = 'registrationUser';

const registrationUser = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: [
			'Allows the registration of a new user, and upon success, it ',
			'returns a confirmation message.',
		].join(''),
		description: [
			'The POST route /api/registration provides the functionality to ',
			'register a new user in the system. By submitting a request to ',
			'this URL with necessary information such as username, email, ',
			'password, etc., the server performs the necessary operations to ',
			'create a user profile in the database. Upon successful ',
			'registration, the route returns a confirmation message, ',
			'indicating that the registration process was successful. ',
			'This message may include additional details, such as ',
			'instructions for the next steps in the process or important ',
			'information for the newly registered user. It is crucial to ',
			'include security mechanisms to protect user data and implement ',
			'validations to ensure the integrity of the submitted information.',
			' In case of failure, the route may return an error message ',
			'specifying the reason for the failure, for example, if the ',
			'email address is already associated with an existing account.',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({ type: RegistrationUserBody })(target, propertyKey, descriptor);
	ApiCreatedResponse({
		type: RegistrationUserCreatedResponse,
	})(target, propertyKey, descriptor);
	ApiBadRequestResponse({
		type: RegistrationBadRequestResponse,
	})(target, propertyKey, descriptor);
	ApiConflictResponse()(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'registrationUser':
			return registrationUser;
	}
};

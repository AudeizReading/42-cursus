import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { SignInBody, SignInReturn } from './auth.schema';
import { ApiBadRequestResponse, ApiOkResponse } from '$app/app.decorator';

type Route = 'signIn';

const signIn = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: [
			'Enables user sign-in and returns a JWT upon successful ',
			'authentication.',
		].join(''),
		description: [
			'The POST route /api/auth/login facilitates the authentication ',
			'and sign-in process for users. Clients should submit a request ',
			'to this endpoint with the required credentials, typically ',
			'including the username or email and password. The server ',
			'validates these credentials, and if they are correct, it responds',
			' by generating and returning a JWT (JSON Web Token).',
			'\n\n',
			'The JWT serves as a secure and time-limited authentication token,',
			' allowing the user to make authenticated requests to protected ',
			'routes. It is essential to implement proper security measures, ',
			'such as password hashing and protection against brute force ',
			'attacks, to ensure the safety of user credentials.',
			'\n\n',
			'In the case of successful authentication, the route issues a ',
			'JWT that the client can include in subsequent requests for ',
			'authorization. If there are authentication failures, the route ',
			'returns an appropriate error message to inform the client of the ',
			'issue, such as incorrect credentials or an inactive account. ',
			'This JWT-based authentication process enhances the security of ',
			'user sessions and provides a streamlined approach to user sign-in.',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({ type: SignInBody })(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
	ApiOkResponse({ type: SignInReturn })(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'signIn':
			return signIn;
	}
};

import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
	OkResponseRecovery,
	OkResponseValidate,
	RecoveryPasswordBody,
} from './email.schema';
import {
	ApiBadRequestResponse,
	ApiGoneResponse,
	ApiOkResponse,
} from '$app/app.decorator';

type Route = 'validate' | 'recoveryPassword';

const validate = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: [
			"Validates a user's email address. The link sent to the user ",
			"during registration activates the user's account, and upon ",
			'validation via the token, a JWT is returned.',
		].join(''),
		description: [
			'The GET route /api/email/validate/{token} serves the purpose of ',
			"validating a user's email address. During the registration ",
			'process, a validation link containing a token is sent to the ',
			'user. To activate their account, the user must access this ',
			'endpoint by following the link and providing the token as a ',
			'parameter.',
			'\n\n',
			"Upon successful validation, the user's account is activated, ",
			'and the route responds by issuing a JWT (JSON Web Token). This ',
			"JWT serves as proof of the account's active status and can be ",
			"used for subsequent authenticated requests. It's essential to ",
			'implement secure token validation mechanisms to ensure the ',
			'integrity of the activation process and protect against ',
			'unauthorized attempts.',
			'\n\n',
			'In case of an invalid or expired token, the route should return ',
			'an appropriate error message, guiding the user on the necessary ',
			'steps to resolve the issue. Implementing email validation with a ',
			'JWT provides a secure and streamlined method for activating user',
			' accounts while maintaining the confidentiality of user data.',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiParam({
		name: 'token',
		required: true,
		schema: { type: 'string' },
	})(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
	ApiGoneResponse()(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseValidate })(
		target,
		propertyKey,
		descriptor,
	);
};

const recoveryPassword = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: [
			'Sends an email to the user with a one-time-use token for password',
			' recovery and returns a success message.',
		].join(''),
		description: [
			'The POST route /api/email/send/recovery is designed for ',
			'initiating the password recovery process. When a user requests a',
			' password reset, the server generates a one-time-use token, ',
			"associates it with the user's account, and sends an email ",
			"containing the token to the user's registered email address.",
			'\n\n',
			'Upon successful email delivery, the route responds by returning ',
			'a success message. This message typically provides information ',
			'instructing the user on the next steps in the password recovery ',
			"process. It's important to implement security measures, such as ",
			'expiring the token after a specific time period, to enhance the ',
			'overall security of the password recovery mechanism.',
			'\n\n',
			'The user, upon receiving the email, can follow the instructions ',
			'to use the provided token to reset their password securely. In ',
			'case of any issues, such as an invalid email address or errors ',
			'during the token generation process, the route should return an ',
			'appropriate error message, guiding the user on how to resolve ',
			'the issue. Implementing this route enhances user security by ',
			'providing a secure and user-friendly method for password recovery.',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({
		type: RecoveryPasswordBody,
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseRecovery })(
		target,
		propertyKey,
		descriptor,
	);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'validate':
			return validate;
		case 'recoveryPassword':
			return recoveryPassword;
	}
};

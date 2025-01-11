import { ApiProperty } from '@nestjs/swagger';
import {
	IgetErrorBodyReturn,
	IregistrationUserBody,
	IregistrationUserReturn,
} from './registration.interface';
import { BadRequestResponse } from '$security/security.schema';

export class RegistrationUserBody implements IregistrationUserBody {
	@ApiProperty({
		example: 'example@example.fr',
	})
	email: string;
	@ApiProperty({
		example: 'Etalon Sauvage',
	})
	username: string;
	@ApiProperty({
		example: 'Florence',
	})
	firstName: string;
	@ApiProperty({
		example: 'Forestie',
	})
	lastName: string;
	@ApiProperty({
		example: 'Password42@',
	})
	password: string;
}

export class RegistrationUserCreatedResponse
	implements IregistrationUserReturn
{
	@ApiProperty()
	message: string;
}

export class MessageTypeBadRequest implements IgetErrorBodyReturn {
	@ApiProperty({
		required: false,
	})
	email?: string[];
	@ApiProperty({
		required: false,
	})
	username?: string[];
	@ApiProperty({
		required: false,
	})
	firstName?: string[];
	@ApiProperty({
		required: false,
	})
	lastName?: string[];
	@ApiProperty({
		required: false,
	})
	password?: string[];
}

export class RegistrationBadRequestResponse extends BadRequestResponse {
	@ApiProperty({
		type: MessageTypeBadRequest,
	})
	message: string;
}

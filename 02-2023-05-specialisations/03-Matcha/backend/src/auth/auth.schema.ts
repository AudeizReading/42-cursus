import { ApiProperty } from '@nestjs/swagger';
import { IJWT, ILogin } from './auth.interface';

export class SignInBody implements ILogin {
	@ApiProperty({
		example: 'Etalon Sauvage',
	})
	username: string;
	@ApiProperty({
		example: 'Password42@',
	})
	password: string;
}

export class SignInReturn implements IJWT {
	@ApiProperty()
	access_token: string;
}

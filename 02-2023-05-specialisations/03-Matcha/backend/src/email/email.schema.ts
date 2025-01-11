import { ApiProperty } from '@nestjs/swagger';
import { IrecoveryBody, IrecoveryReturn } from './email.interface';
import { IJWT } from 'src/auth/auth.interface';

export class RecoveryPasswordBody implements IrecoveryBody {
	@ApiProperty({
		example: 'example@example.fr',
	})
	email: string;
}

export class OkResponseValidate implements IJWT {
	@ApiProperty()
	access_token: string;
}

export class OkResponseRecovery implements IrecoveryReturn {
	@ApiProperty()
	message: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class TokenExpired {
	@ApiProperty()
	expired: boolean;
}

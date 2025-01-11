import { ApiProperty } from '@nestjs/swagger';
import { Provider } from './db.interface';

export class Oauth {
	@ApiProperty()
	id: string;
	@ApiProperty()
	id_provider: string;
	@ApiProperty()
	provider: Provider;
}

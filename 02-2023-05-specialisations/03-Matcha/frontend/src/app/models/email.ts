import { ApiBody } from './api';

export interface EmailRecoveryBodyDTO extends ApiBody {
	email: string;
}

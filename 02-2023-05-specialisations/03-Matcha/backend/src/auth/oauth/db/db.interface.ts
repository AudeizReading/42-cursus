export type Provider = 'Facebook' | 'Google';

interface IOauthType<T, P> {
	id: number;
	id_oauth: string;
	provider: P;
	access_token: string;
	expires_in: T;
	userId?: number;
}

export interface IDatabaseOauth extends IOauthType<number, Provider> {}

export interface IOauth extends IOauthType<Date, string> {}

export type Reason = 'validEmail' | 'recoveryPassword';
export const reasons: Reason[] = ['validEmail', 'recoveryPassword'];

interface ITokenType<T, B> {
	id: number;
	reason: T;
	token: string;
	expired: B;
	userId: number;
}

export type IToken = ITokenType<Reason, boolean>;
export type IDatabaseToken = ITokenType<string, number>;

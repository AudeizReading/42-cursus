export type Gender = 'Man' | 'Woman';
export const genders: Gender[] = ['Man', 'Woman'];

interface IGenderType<T> {
	id: number;
	gender: T;
	userId: number;
}

export type IGender = IGenderType<Gender>;
export type IDatabaseGender = IGenderType<string>;

export type Preference = 'Gay' | 'Bisexual' | 'Lesbian' | 'Hetero';
export const preferences: Preference[] = [
	'Gay',
	'Bisexual',
	'Lesbian',
	'Hetero',
];

interface ISexualPreferenceType<T> {
	id: number;
	preference: T;
	userId: number;
}

export type ISexualPreference = ISexualPreferenceType<Preference>;
export type IDatabaseSexualPreference = ISexualPreferenceType<string>;

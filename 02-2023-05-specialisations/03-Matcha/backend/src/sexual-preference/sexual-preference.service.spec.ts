import { Test, TestingModule } from '@nestjs/testing';
import { SexualPreferenceService } from './sexual-preference.service';
import { Preference, preferences } from './sexual-preference.interface';
import { UserService } from '$app/user/user.service';
import { Gender } from '$app/gender/gender.interface';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('SexualPreferenceService', () => {
	let service: SexualPreferenceService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [SexualPreferenceService, Logger],
		}).compile();

		service = module.get<SexualPreferenceService>(SexualPreferenceService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('setPreference', () => {
		const setPreference = (
			preference: Preference,
			error: boolean = false,
		): void =>
			it(preference == ('' as Preference) ? 'empty' : preference, () => {
				if (error)
					expect(() => service.setPreference(undefined)).toThrow();
				else
					expect(() =>
						service.setPreference(preference),
					).not.toThrow();
			});

		const error: Preference[] = [
			undefined,
			'' as Preference,
			'Invalid' as Preference,
		];

		error.forEach((preference) => setPreference(preference, true));
		preferences.forEach((preference) => setPreference(preference));
	});

	describe('getPreference', () => {
		it('Get Value preference', () => {
			service.setPreference('Hetero');
			expect(service.getPreference()).toBe('Hetero');
		});
	});

	describe('Recovery', () => {
		it('Recovery Throw', async () => {
			try {
				await service.recover(undefined);
				expect(true).toBe(false);
			} catch {
				expect(true).toBe(true);
			}
		});
	});

	describe('getPreferences', () => {
		const createUser = (username: string): void =>
			it(`Create instance User: ${username}`, async () => {
				const user = new UserService().new({
					firstName: 'firstname',
					lastName: 'lastname',
					email: `${username}@example.fr`,
					username,
					hashPassword: UserService.passwordToHash('Password42@'),
				});
				await user.update();
			});

		const setGender = (username: string, type: Gender): void =>
			it(`setGender ${type}`, async () => {
				try {
					const user = await new UserService().getByUsername(
						username,
					);
					await user.setGender(type);
					expect(false).toBe(true);
				} catch {
					expect(true).toBe(true);
				}
			});

		const getPreferences = (
			username: string,
			preferencesValue: Preference[],
		): void =>
			it('get Value Preferences', async () => {
				const user = await new UserService().getByUsername(username);
				const preferences = await service.getPreferences(user);
				expect(preferences).toMatchObject(preferencesValue);
			});

		const genderPreferenceTest = (
			username: string,
			gender: Gender,
			preferencesValue: Preference[],
		): void => {
			createUser(username);
			setGender(username, gender);
			getPreferences(username, preferencesValue);
		};

		genderPreferenceTest('preferenceMan', 'Man', [
			'Gay',
			'Bisexual',
			'Hetero',
		]);
		genderPreferenceTest('preferenceWoman', 'Woman', [
			'Lesbian',
			'Bisexual',
			'Hetero',
		]);
	});
});

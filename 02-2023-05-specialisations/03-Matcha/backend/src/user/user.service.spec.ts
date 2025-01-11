import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { IUser } from './user.interface';
import { ITag } from '$tag/tag.interface';
import {
	ISexualPreference,
	Preference,
	preferences,
} from '$sexual-preference/sexual-preference.interface';
import { UserTest, createUser } from '$test/utils/user.service.utils';
import { TagTest } from '$test/utils/tag.service.utils';
import { Gender, IGender, genders } from '$app/gender/gender.interface';
import { assetsFilesPath } from '$test/assets/assets.module';
import * as fs from 'fs';
import { IFile } from '$app/file/file.interface';
import { IBiography } from '$app/biography/biography.interface';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

describe('UserService', () => {
	let service: UserService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserService, Logger],
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('GetBy', () => {
		describe('Username', () => {
			let user: UserService;
			const username = UserTest.username;

			it(`Create instance user: ${username}`, async () => {
				user = await createUser(service, username);
				expect(user).toBeDefined();
			});

			it(`Match current user`, async () => {
				user.setLocationType('IP');
				expect(await user.getByUsername(username)).toStrictEqual(user);
			});
		});

		describe('Email', () => {
			let user: UserService;
			const username = UserTest.username;

			it(`Create instance user: ${username}`, async () => {
				user = await createUser(service, username);
				expect(user).toBeDefined();
			});

			it(`Match current user`, async () => {
				user.setLocationType('IP');
				expect(
					await user.getByEmail(`${username}@example.fr`),
				).toStrictEqual(user);
			});
		});
	});

	describe('Normalize', () => {
		let user: UserService;
		const username = UserTest.username;

		it(`Create instance user: ${username}`, async () => {
			user = await createUser(service, username);
			expect(user).toBeDefined();
		});

		it(`Normalize ${username}`, () => {
			expect(user.normalize()).toMatchObject<IUser>({
				id: user.getId(),
				email: user.getEmail(),
				username: user.getUsername(),
				firstName: user.getFirstName(),
				lastName: user.getLastName(),
				validateEmail: user.isValidateEmail(),
				locationType: user.getLocationType(),
				status: expect.any(String),
				fameRating: expect.any(Number),
			});
		});
	});

	describe('Tag', () => {
		const emptyTag = (): void =>
			it(`Empty Tag`, async () => {
				expect(await user.getTag()).toStrictEqual([]);
			});

		const setTag = (tagName: string): void =>
			it(`Set tag ${tagName} in ${username}`, async () => {
				await user.setTag(tagName);
			});

		const getTag = (tags: ITag[]): void =>
			it(`Get tag`, async () => {
				expect(await user.getTag()).toStrictEqual(tags);
			});

		const deleteTag = (tagName: string): void =>
			it(`Delete tag ${tagName}`, async () => {
				await user.deleteTag(tagName);
			});

		let user: UserService;
		const username = UserTest.username;
		const tags: ITag[] = [];
		const NB_TAG = 10;

		for (let i = 0; i < NB_TAG; i++) {
			tags.push({ id: expect.any(Number), name: TagTest.tagName });
		}

		it(`Create instance user: ${username}`, async () => {
			user = await createUser(service, username);
			expect(user).toBeDefined();
		});

		emptyTag();
		for (const tag of tags) setTag(tag.name);
		getTag(tags);
		for (const tag of tags) deleteTag(tag.name);
		emptyTag();
	});

	describe('Gender', () => {
		const getGender = (value: Gender | undefined): void =>
			it(`Get gender ${value}`, async () => {
				if (value == undefined)
					expect(await user.getGender()).toBe(value);
				else
					expect(await user.getGender()).toMatchObject<IGender>({
						id: expect.any(Number),
						gender: value,
						userId: user.getId(),
					});
			});

		const setGender = (value: Gender): void =>
			it(`Set Gender ${value} in ${username}`, async () => {
				await user.setGender(value);
			});

		const genderTest = (value: Gender): void => {
			setGender(value);
			getGender(value);
		};

		let user: UserService;
		const username = UserTest.username;

		it(`Create instance user: ${username}`, async () => {
			user = await createUser(service, username);
			expect(user).toBeDefined();
		});

		getGender(undefined);
		genders.forEach((gender) => genderTest(gender));
	});

	describe('Sexual Preference', () => {
		const getSexualPreference = (value: Preference | undefined): void =>
			it(`Get Sexual Preference ${value}`, async () => {
				if (value == undefined)
					expect(await user.getSexualPreference()).toBe(value);
				else
					expect(
						await user.getSexualPreference(),
					).toMatchObject<ISexualPreference>({
						id: expect.any(Number),
						preference: value,
						userId: user.getId(),
					});
			});

		const setSexualPreference = (value: Preference): void =>
			it(`Set Sexual Preference ${value} in ${username}`, async () => {
				await user.setSexualPreference(value);
			});

		const sexualPreferenceTest = (value: Preference): void => {
			setSexualPreference(value);
			getSexualPreference(value);
		};

		let user: UserService;
		const username = UserTest.username;

		it(`Create instance user: ${username}`, async () => {
			user = await createUser(service, username);
			expect(user).toBeDefined();
		});

		getSexualPreference(undefined);
		preferences.forEach((preference) => sexualPreferenceTest(preference));
	});

	describe('Picture', () => {
		const getPictureProfil = (pictureValue: IFile[]): void =>
			it(`Check picture profil ${username}`, async () => {
				const tmp: IFile[] = [];
				pictureValue.forEach((picture) => {
					tmp.push(picture);
				});
				expect(await user.getPictureProfil()).toStrictEqual(tmp);
			});

		const addPicture = (): void =>
			assetsFilesPath.picture.forEach((filePath) => {
				const filePathSplit = filePath.split('/');
				const fileName = filePathSplit[filePathSplit.length - 1];
				const buffer = fs.readFileSync(filePath);
				it(`add ${fileName} in profil ${username}`, async () => {
					const values = await user.addPictureToProfil(
						buffer,
						fileName,
					);
					expect(values).toMatchObject<IFile>({
						url: expect.any(String),
						id: expect.any(Number),
						name: expect.any(String),
						originalName: fileName,
						context: 'PROFIL',
						type: 'PICTURE',
						size: expect.any(Number),
					});
					pictures.push(values);
				});
			});

		const removePictureById = (pictureValue: IFile[]): void =>
			it(`remove all pictures in profile ${username} by id`, async () => {
				for await (const picture of pictureValue) {
					await user.removePictureById(picture.id);
				}
				while (pictures.length) {
					pictures.pop();
				}
			});

		const removePictureByName = (pictureValue: IFile[]): void =>
			it(`remove all pictures in profile ${username} by Name`, async () => {
				for await (const picture of pictureValue) {
					await user.removePictureByName(picture.name);
				}
				while (pictures.length) {
					pictures.pop();
				}
			});

		const getDefaultPicture = (): void =>
			it(`Check default picture ${username}`, async () => {
				expect(await user.getDefaultPictureProfil()).toStrictEqual(
					defaultPicture,
				);
			});

		const setDefaultPicture = (
			pictureValue: IFile[],
			index: number,
		): void =>
			it(`Set default picture ${index} for user ${username}`, async () => {
				let i = -1;
				for await (const pic of pictureValue) {
					i++;
					if (i != index) continue;
					defaultPicture = pic;
					await user.setDefaultPicture(defaultPicture.id);
				}
			});

		let user: UserService;
		const username = UserTest.username;
		const pictures: IFile[] = [];
		let defaultPicture: IFile = undefined;

		it(`Create instance user: ${username}`, async () => {
			user = await createUser(service, username);
			expect(user).toBeDefined();
		});

		getPictureProfil(pictures);
		addPicture();
		getPictureProfil(pictures);
		removePictureById(pictures);
		getPictureProfil(pictures);
		addPicture();
		getPictureProfil(pictures);
		removePictureByName(pictures);
		getPictureProfil(pictures);
		addPicture();
		getPictureProfil(pictures);

		getDefaultPicture();
		setDefaultPicture(pictures, 0);
		getDefaultPicture();
		setDefaultPicture(pictures, 1);
		getDefaultPicture();
	});

	describe('Description', () => {
		const getDescription = (description: string | undefined): void =>
			it(`Check description for ${username}`, async () => {
				const value = await user.getDescription();
				if (description == undefined) {
					expect(value).toBe(undefined);
					return;
				}
				expect(value).toMatchObject<IBiography>({
					id: expect.any(Number),
					description,
					userId: user.getId(),
				});
			});

		const setDescription = (description: string): void =>
			it(`Set decription ${description} for ${username}`, async () => {
				await user.setDescription(description);
			});

		const descriptionTest = (description: string): void => {
			setDescription(description);
			getDescription(description);
		};

		let user: UserService;
		const username = UserTest.username;

		it(`Create instance user: ${username}`, async () => {
			user = await createUser(service, username);
			expect(user).toBeDefined();
		});

		getDescription(undefined);
		descriptionTest('');
		descriptionTest('My first description');
		descriptionTest('My seconde description');
		descriptionTest('');
	});

	describe('GetMe', () => {
		const setGender = (value: Gender): void =>
			it(`Set Gender ${value} in ${username}`, async () => {
				await user.setGender(value);
			});

		const setSexualPreference = (value: Preference): void =>
			it(`Set Sexual Preference ${value} in ${username}`, async () => {
				await user.setSexualPreference(value);
			});

		const setTag = (tagName: string): void =>
			it(`Set tag ${tagName} in ${username}`, async () => {
				await user.setTag(tagName);
			});

		const setDescription = (description: string): void =>
			it(`Set decription ${description} for ${username}`, async () => {
				await user.setDescription(description);
			});

		const setBirthday = (birthday: number): void =>
			it(`Set Birthday ${birthday} for ${username}`, () => {
				user.setBirthday(birthday);
			});

		const addPicture = (): void =>
			assetsFilesPath.picture.forEach((filePath) => {
				const filePathSplit = filePath.split('/');
				const fileName = filePathSplit[filePathSplit.length - 1];
				const buffer = fs.readFileSync(filePath);
				it(`add ${fileName} in profil ${username}`, async () => {
					const values = await user.addPictureToProfil(
						buffer,
						fileName,
					);
					expect(values).toMatchObject<IFile>({
						url: expect.any(String),
						id: expect.any(Number),
						name: expect.any(String),
						originalName: fileName,
						context: 'PROFIL',
						type: 'PICTURE',
						size: expect.any(Number),
					});
					pictures.push(values);
				});
			});

		interface Property {
			tags?: boolean;
			gender?: boolean;
			sexualPreference?: boolean;
			pictures?: boolean;
			defaultPicture?: boolean;
			description?: boolean;
		}

		const checkProperty = (nameTest: string, property?: Property): void =>
			describe(`Check property for ${username}: ${nameTest}`, () => {
				const elements = [
					'tags',
					'gender',
					'sexualPreference',
					'pictures',
					'defaultPicture',
					'description',
				];
				let values: IUser;

				it(`getMe ${username}`, async () => {
					values = await user.getMe();
				});

				elements.forEach((elem) => {
					it(`Check property ${elem} for ${username}`, () => {
						if (property?.[elem])
							expect(values).toHaveProperty(elem);
						else expect(values).not.toHaveProperty(elem);
					});
				});
			});

		const setDefaultPicture = (
			pictureValue: IFile[],
			index: number,
		): void =>
			it(`Set default picture ${index} for user ${username}`, async () => {
				let i = -1;
				for await (const pic of pictureValue) {
					i++;
					if (i != index) continue;
					defaultPicture = pic;
					await user.setDefaultPicture(defaultPicture.id);
				}
			});

		let user: UserService;
		const username = UserTest.username;
		const gender: Gender = 'Man';
		const sexualPreference: Preference = 'Hetero';
		const tag: string = TagTest.tagName;
		const description: string = 'My Super description';
		const pictures: IFile[] = [];
		let defaultPicture: IFile;

		it(`Create instance user: ${username}`, async () => {
			user = await createUser(service, username);
			expect(user).toBeDefined();
		});

		let property = {};

		checkProperty('default');

		setGender(gender);
		property = { ...property, gender: true };
		checkProperty('gender', property);

		setSexualPreference(sexualPreference);
		property = { ...property, sexualPreference: true };
		checkProperty('sexual preference', property);

		setTag(tag);
		property = { ...property, tags: true };
		checkProperty('tags', property);

		setDescription(description);
		property = { ...property, description: true };
		checkProperty('description', property);

		addPicture();
		property = { ...property, pictures: true };
		checkProperty('pictures', property);

		setDefaultPicture(pictures, 0);
		property = { ...property, defaultPicture: true };
		checkProperty('defaultPicture', property);

		setBirthday(795600000000);

		it(`getMe ${username} check value`, async () => {
			const tags = [
				{
					id: expect.any(Number),
					name: tag,
				},
			];
			expect(await user.getMe()).toMatchObject<IUser>({
				...user.normalize(),
				tags,
				gender,
				sexualPreference,
				pictures,
				defaultPicture,
				description,
			});
		});
	});
});

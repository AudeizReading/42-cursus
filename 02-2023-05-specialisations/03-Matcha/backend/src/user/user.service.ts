import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ADatabase } from '$database/ADatabase';
import * as bcrypt from 'bcrypt';
import {
	IDatabaseUser,
	IUser,
	InewUser,
	LocationType,
	UserPublic,
} from '$user/user.interface';
import { RegistrationService } from '$registration/registration.service';
import { TagService } from '$tag/tag.service';
import { UserTagService } from '$user_tag/user_tag.service';
import { ITag } from '$tag/tag.interface';
import { Context, IFile, Type } from '$file/file.interface';
import { FileService } from '$file/file.service';
import { UserFileService } from '$user_file/user_file.service';
import { DefaultPictureService } from '$app/default_picture/default_picture.service';
import { BiographyService } from '$app/biography/biography.service';
import { IBiography } from '$app/biography/biography.interface';
import { Gender, IGender } from '$app/gender/gender.interface';
import { GenderService } from '$app/gender/gender.service';
import {
	ISexualPreference,
	Preference,
} from '$app/sexual-preference/sexual-preference.interface';
import { SexualPreferenceService } from '$app/sexual-preference/sexual-preference.service';
import { ViewService } from '$app/view/view.service';
import { LikeService } from '$app/like/like.service';
import { LocationIPService } from '$app/location/locationIp.service';
import { LocationFakeService } from '$app/location/locationFake.service';
import { LocationNavigatorService } from '$app/location/locationNavigator.service';
import { differenceInYears } from 'date-fns';
import { BlockService } from '$app/block/block.service';
import { ReportService } from '$app/report/report.service';
import { ChatService } from '$app/chat/chat.service';
import { DbService } from '$app/auth/oauth/db/db.service';
import { Oauth } from '$app/auth/oauth/db/db.schema';
import { IReport } from '$app/report/report.interface';

@Injectable()
export class UserService extends ADatabase<IDatabaseUser, UserService, IUser> {
	private email: string;
	private username: string;
	private firstName: string;
	private lastName: string;
	private hashPassword: string;
	private validateEmail = false;
	private locationType: LocationType;
	private birthday: Date;
	private status: string;
	private loggerService: Logger;
	private fameRating: number;

	constructor() {
		super(UserService, 'user', ['loggerService']);
		this.loggerService = new Logger();
	}

	new(user: InewUser): UserService {
		if (user == undefined) throw new Error('User is undefined');
		const newUser = new UserService();
		if (user.id != undefined) newUser.setId(user.id);
		newUser.setEmail(user.email);
		newUser.setUsername(user.username);
		newUser.setFirstName(user.firstName);
		newUser.setLastName(user.lastName);
		newUser.setHashPassword(user.hashPassword);
		newUser.setLocationType('IP');
		newUser.setFameRating(0);
		newUser.status = 'NOT_CONNECTED';
		return newUser;
	}

	setFameRating(value: number): void {
		this.fameRating = value;
	}

	getFameRating(): number {
		return this.fameRating;
	}

	async getByUsername(username: string): Promise<UserService> {
		const users = await this.get(username, 'username');
		if (users.length != 1) {
			throw new Error(`${users.length} user`);
		}
		return users[0] as UserService;
	}

	async getByEmail(email: string): Promise<UserService> {
		const users = await this.get(email, 'email');
		if (users.length != 1) {
			throw new Error(`${users.length} user`);
		}
		return users[0] as UserService;
	}

	setBirthday(timestamp: number): void {
		const now = new Date();
		const birthday = new Date(timestamp);
		const diff = differenceInYears(now, birthday);
		if (diff < 18) {
			throw new Error('You must be of legal age to use our service.');
		}
		this.birthday = birthday;
	}

	getBirthday(): Date {
		return this.birthday;
	}

	getBirthdayTimeStamp(): number {
		return this.birthday.getTime();
	}

	normalize(): IUser {
		const {
			id,
			email,
			username,
			firstName,
			lastName,
			validateEmail,
			locationType,
			birthday,
			status,
			fameRating,
		} = this;
		return {
			id,
			email,
			username,
			firstName,
			lastName,
			validateEmail,
			locationType,
			birthday,
			status,
			fameRating,
		};
	}

	deserialize(database: IDatabaseUser): void {
		if (database == undefined)
			throw new Error('Deserialization is impossible');
		this.setId(database.id);
		this.setEmail(database.email);
		this.setUsername(database.username);
		this.setFirstName(database.firstName);
		this.setLastName(database.lastName);
		this.setHashPassword(database.hashPassword);
		this.setValidateEmail(
			database.validateEmail == 1
				? true
				: database.validateEmail == 0
					? false
					: undefined,
		);
		this.setLocationType(database.locationType);
		this.setFameRating(database.fameRating);
		this.status = database.status;
		if (database?.birthday) this.setBirthday(database.birthday);
	}

	static passwordToHash(password: string): string {
		if (!RegistrationService.passwordIsValid(password))
			throw new Error('Password is invalid');
		const salt = bcrypt.genSaltSync();
		return bcrypt.hashSync(password, salt);
	}

	static comparePasswordhash(password: string, hash: string): boolean {
		if (!RegistrationService.passwordIsValid(password))
			throw new Error('Password is invalid');
		return bcrypt.compareSync(password, hash);
	}

	compare(password: string): boolean {
		return UserService.comparePasswordhash(
			password,
			this.getHashPassword(),
		);
	}

	setEmail(email: string): void {
		if (!RegistrationService.emailIsValid(email))
			throw new Error(`Email is invalid: ${email}`);
		this.email = email;
	}

	getEmail(): string {
		return this.email;
	}

	setUsername(username: string): void {
		if (!RegistrationService.usernameIsValid(username))
			throw new Error(`Username is invalid: ${username}`);
		this.username = username;
	}

	getUsername(): string {
		return this.username;
	}

	setFirstName(firstName: string): void {
		if (!RegistrationService.nameIsValid(firstName))
			throw new Error(`Firstname is invalid: ${firstName}`);
		this.firstName = firstName;
	}

	getFirstName(): string {
		return this.firstName;
	}

	setLastName(lastName: string): void {
		if (!RegistrationService.nameIsValid(lastName))
			throw new Error(`Lastname is invalid: ${lastName}`);
		this.lastName = lastName;
	}

	getLastName(): string {
		return this.lastName;
	}

	setHashPassword(hashPassword: string): void {
		if (hashPassword == undefined)
			throw new Error('This is not hash Password');
		this.hashPassword = hashPassword;
	}

	getHashPassword(): string {
		return this.hashPassword;
	}

	setValidateEmail(state: boolean): void {
		if (typeof state != 'boolean') throw new Error('State is not Boolean');
		this.validateEmail = state;
	}

	isValidateEmail(): boolean {
		return this.validateEmail;
	}

	setLocationType(type: LocationType): void {
		if (!['IP', 'NAVIGATOR', 'FAKE'].includes(type)) {
			throw new Error(`${type} is not valid location type`);
		}
		this.locationType = type;
	}

	getLocationType(): LocationType {
		return this.locationType;
	}

	async getMe(): Promise<IUser> {
		if (this.getId() == undefined) throw new Error('User is undefined');
		let defaultData: IUser = {
			id: this.getId(),
			email: this.getEmail(),
			username: this.getUsername(),
			firstName: this.getFirstName(),
			lastName: this.getLastName(),
			validateEmail: this.isValidateEmail(),
			locationType: this.getLocationType(),
			status: this.getStatus(),
			fameRating: this.getFameRating(),
		};
		const birthday = this.getBirthday();
		if (birthday) {
			defaultData = {
				...defaultData,
				birthday,
			};
		}
		const tags = await this.getTag();
		const pictures = await this.getPictureProfil();
		const defaultPicture = await this.getDefaultPictureProfil();
		const description = await this.getDescription();
		const gender = await this.getGender();
		const preference = await this.getSexualPreference();
		const reported = await this.getReported<number>();
		if (reported > 0) defaultData = { ...defaultData, reported };
		if (tags.length > 0) defaultData = { ...defaultData, tags };
		if (pictures.length > 0) defaultData = { ...defaultData, pictures };
		if (defaultPicture != undefined)
			defaultData = {
				...defaultData,
				defaultPicture: { ...defaultPicture },
			};
		if (description != undefined)
			defaultData = {
				...defaultData,
				description: description.description,
			};
		if (gender != undefined)
			defaultData = { ...defaultData, gender: gender.gender };
		if (preference != undefined)
			defaultData = {
				...defaultData,
				sexualPreference: preference.preference,
			};
		const locations = {};
		try {
			const locationIPService = new LocationIPService();
			const location = await locationIPService.findLocationByUser(this);
			locations['ip'] = location.normalize();
		} catch {
			/* ignored */
		}
		try {
			const locationFakeService = new LocationFakeService();
			const location = await locationFakeService.findLocationByUser(this);
			locations['fake'] = location.normalize();
		} catch {
			/* ignored */
		}
		try {
			const locationNavigatorService = new LocationNavigatorService();
			const location =
				await locationNavigatorService.findLocationByUser(this);
			locations['navigator'] = location.normalize();
		} catch {
			/* ignored */
		}
		if (Object.keys(locations).length != 0) {
			defaultData = {
				...defaultData,
				locations,
			};
		}
		const oauth = await this.getOauth();
		if (oauth?.length != 0) {
			defaultData = {
				...defaultData,
				oauth,
			};
		}
		return defaultData;
	}

	async getOauth(): Promise<Oauth[]> {
		const oauthService = new DbService();
		return await oauthService.getOauth(this);
	}

	async getPublic(): Promise<UserPublic> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { email, validateEmail, oauth, ...values } = await this.getMe();
		return values;
	}

	private async setTagInDB(tag: TagService): Promise<void> {
		if (this.getId() == undefined) throw new Error('User is not define');
		const userTagService = new UserTagService();
		userTagService.setUser(this);
		userTagService.setTag(tag);
		const users = await userTagService.getUsersUsingTag(tag);
		users.forEach((user) => {
			if (user.getId() == this.getId())
				throw new Error(
					`${tag.getName()} is set in user ${this.getUsername()}`,
				);
		});
		await userTagService.update();
	}

	async setTag(name: string): Promise<ITag | undefined> {
		let tag: TagService = new TagService();
		try {
			tag.setName(name);
		} catch (err) {
			throw new Error(err.message);
		}
		try {
			await tag.update();
		} catch (err) {
			this.loggerService.error(err, 'UserService');
			tag = await tag.getByName(name);
		}
		await this.setTagInDB(tag);
		if (tag.getId()) {
			return tag.normalize();
		}
		return undefined;
	}

	async getTag(): Promise<ITag[]> {
		const userTagService = new UserTagService();
		const tags = await userTagService.getTagsUsingUser(this);
		return tags.map((tag) => tag.normalize());
	}

	async getPictureProfil(): Promise<IFile[]> {
		const userFileService = new UserFileService();
		const files = await userFileService.getPictureProfilUser(this);
		return files.map((file) => file.normalize());
	}

	async getDefaultPictureProfil(): Promise<IFile> {
		const defaultPictureService = new DefaultPictureService();
		try {
			await defaultPictureService.recover(this);
			return (await defaultPictureService.getFile()).normalize();
		} catch {
			return undefined;
		}
	}

	async setDefaultPicture(id: number): Promise<void> {
		const defaultPictureService = new DefaultPictureService();
		const pictures: IFile[] = await this.getPictureProfil();
		const picture = pictures.filter((picture) => picture.id == id);
		if (picture.length != 1) {
			throw new BadRequestException('ID file il not valid');
		}
		try {
			await defaultPictureService.recover(this);
			defaultPictureService.setFileId(id);
		} catch {
			defaultPictureService.setUser(this);
			defaultPictureService.setFileId(id);
		}
		await defaultPictureService.update();
	}

	async setDescription(description: string): Promise<void> {
		const biographyService = new BiographyService();
		try {
			await biographyService.recover(this);
			biographyService.setDescription(description);
		} catch {
			biographyService.setUser(this);
			biographyService.setDescription(description);
		}
		await biographyService.update();
	}

	async getDescription(): Promise<IBiography> {
		const biographyService = new BiographyService();
		try {
			await biographyService.recover(this);
			return biographyService.normalize();
		} catch {
			return undefined;
		}
	}

	async setGender(gender: Gender): Promise<void> {
		const genderService = new GenderService();
		try {
			await genderService.recover(this);
			genderService.setGender(gender);
		} catch {
			genderService.setUser(this);
			genderService.setGender(gender);
		}
		await genderService.update();
	}

	async getGender(): Promise<IGender> {
		const genderService = new GenderService();
		try {
			await genderService.recover(this);
			return genderService.normalize();
		} catch {
			return undefined;
		}
	}

	async setSexualPreference(preference: Preference): Promise<void> {
		const sexualPreferenceService = new SexualPreferenceService();
		try {
			await sexualPreferenceService.recover(this);
			sexualPreferenceService.setPreference(preference);
		} catch {
			sexualPreferenceService.setUser(this);
			sexualPreferenceService.setPreference(preference);
		}
		await sexualPreferenceService.update();
	}

	async getSexualPreference(): Promise<ISexualPreference> {
		const sexualPreferenceService = new SexualPreferenceService();
		try {
			await sexualPreferenceService.recover(this);
			return sexualPreferenceService.normalize();
		} catch {
			return undefined;
		}
	}

	async deleteTag(name: string): Promise<ITag | undefined> {
		const tagService = new TagService();
		const tag = await tagService.getByName(name);
		const userTagService = await new UserTagService().getByUserTag(
			this,
			tag,
		);
		await userTagService.delete();
		return tag.normalize();
	}

	private async addFile(
		buffer: Buffer,
		originalName: string,
		type: Type,
		context: Context,
	): Promise<IFile> {
		const fileService = new FileService();
		const userFileService = new UserFileService();
		const file = await fileService.createFile(
			buffer,
			originalName,
			type,
			context,
		);
		if (file.id == undefined) {
			throw new BadRequestException();
		}
		userFileService.setUser(this);
		userFileService.setFileId(file.id);
		await userFileService.update();
		return file;
	}

	async addPictureToProfil(
		buffer: Buffer,
		originalName: string,
	): Promise<IFile> {
		return await this.addFile(buffer, originalName, 'PICTURE', 'PROFIL');
	}

	private async addFileToChat(
		buffer: Buffer,
		originalName: string,
		userToSend: number,
		type: Type,
	): Promise<IFile> {
		const file = await this.addFile(buffer, originalName, type, 'CHAT');
		const chatService = new ChatService();
		await chatService.sendFile(this.getId(), userToSend, file.id);
		return file;
	}

	async addPictureToChat(
		buffer: Buffer,
		originalName: string,
		userToSend: number,
	): Promise<IFile> {
		return await this.addFileToChat(
			buffer,
			originalName,
			userToSend,
			'PICTURE',
		);
	}

	async addVideoToChat(
		buffer: Buffer,
		originalName: string,
		userToSend: number,
	): Promise<IFile> {
		return await this.addFileToChat(
			buffer,
			originalName,
			userToSend,
			'VIDEO',
		);
	}

	async addAudioToChat(
		buffer: Buffer,
		originalName: string,
		userToSend: number,
	): Promise<IFile> {
		return await this.addFileToChat(
			buffer,
			originalName,
			userToSend,
			'AUDIO',
		);
	}

	async removePictureByName(name: string): Promise<void> {
		const userFileService = new UserFileService();
		await userFileService.deleteByName(this, name);
	}

	async removePictureById(id: number): Promise<void> {
		const userFileService = new UserFileService();
		await userFileService.deleteById(this, id);
	}

	async isComplete(): Promise<boolean> {
		const values = await this.getMe();
		if (
			!values?.defaultPicture ||
			!values?.description ||
			!values?.gender ||
			!values?.sexualPreference ||
			!values?.tags ||
			!values?.birthday
		)
			return false;
		return true;
	}

	async getProfilesIVisited(
		limit: number,
		page: number,
	): Promise<{ user: UserPublic; count: number }[]> {
		const viewService = new ViewService();
		viewService.setUser(this);
		return await viewService.getProfilesIVisited(limit, page);
	}

	async getProfilesThatVisitedMe(
		limit: number,
		page: number,
	): Promise<{ user: UserPublic; count: number }[]> {
		const viewService = new ViewService();
		viewService.setUser(this);
		return await viewService.getProfilesThatVisitedMe(limit, page);
	}

	async getLike(limit: number, page: number): Promise<UserPublic[]> {
		const likeService = new LikeService();
		likeService.setUser(this);
		return await likeService.getLike(limit, page);
	}

	async getLiked(limit: number, page: number): Promise<UserPublic[]> {
		const likeService = new LikeService();
		likeService.setUser(this);
		return await likeService.getLiked(limit, page);
	}

	async getMatch(limit: number, page: number): Promise<UserPublic[]> {
		const likeService = new LikeService();
		likeService.setUser(this);
		return await likeService.getMatch(limit, page);
	}

	async setLocationIp(latitude: number, longitude: number): Promise<void> {
		const locationIPService = new LocationIPService();
		await locationIPService.updateLocationByUser(this, latitude, longitude);
	}

	async setLocationFake(latitude: number, longitude: number): Promise<void> {
		const locationIPService = new LocationFakeService();
		await locationIPService.updateLocationByUser(this, latitude, longitude);
	}

	async setLocationNavigator(
		latitude: number,
		longitude: number,
	): Promise<void> {
		const locationIPService = new LocationNavigatorService();
		await locationIPService.updateLocationByUser(this, latitude, longitude);
	}

	async setOnline(): Promise<void> {
		const user = await this.getByPK(this.getId());
		user.status = 'ONLINE';
		await user.update();
	}

	async setOffline(): Promise<void> {
		const user = await this.getByPK(this.getId());
		user.status = new Date().toISOString();
		await user.update();
	}

	getStatus(): string {
		return this.status;
	}

	async blockUser(blockId: number): Promise<void> {
		const blockService = new BlockService();
		blockService.setUser(this);
		await blockService.setBlockId(blockId);
		await blockService.update();
	}

	async unblockUser(blockId: number): Promise<void> {
		const blockService = new BlockService();
		await blockService.unblock(this, blockId);
	}

	async isBlocked(user: UserService): Promise<boolean> {
		const blockService = new BlockService();
		blockService.setUser(this);
		return await blockService.isBlocked(user);
	}

	async reportUser(reportId: number): Promise<void> {
		const reportService = new ReportService();
		reportService.setUser(this);
		await reportService.setReportId(reportId);
		await reportService.update();
	}

	async getReported<T extends number | IReport[]>(
		raw: boolean = false,
	): Promise<T> {
		try {
			const reportService = new ReportService();
			reportService.setUser(this);
			if (raw) {
				return (await reportService.getReported()) as T;
			}
			return (await reportService.getReported()).length as T;
		} catch (err) {
			this.loggerService.error(err, 'UserService');
			return 0 as T;
		}
	}

	async isMatch(user: UserService): Promise<boolean> {
		const likeService = new LikeService();
		likeService.setUser(this);
		return await likeService.isMatch(user);
	}

	async isLike(userId: number): Promise<boolean> {
		const likeService = new LikeService();
		likeService.setUser(this);
		return await likeService.profilIsLiked(userId);
	}

	async isView(userId: number): Promise<boolean> {
		const viewService = new ViewService();
		viewService.setUser(this);
		return await viewService.isView(userId);
	}

	async getLikeMeCount(): Promise<number> {
		const likeService = new LikeService();
		const likes = await likeService.countLike(this);
		return likes;
	}

	async getLikedCount(): Promise<number> {
		const likeService = new LikeService();
		const likes = await likeService.countLiked(this);
		return likes;
	}

	async getViewMeCount(): Promise<number> {
		const viewService = new ViewService();
		const views = await viewService.countView(this);
		return views;
	}

	async getViewedCount(): Promise<number> {
		const viewService = new ViewService();
		const views = await viewService.countViewed(this);
		return views;
	}

	async getMatchCount(): Promise<number> {
		const likeService = new LikeService();
		const matchs = await likeService.getMatchCount(this);
		return matchs;
	}

	async getBlockedCount(): Promise<number> {
		const blockService = new BlockService();
		const blocked = await blockService.getBlockedCount(this);
		return blocked;
	}
}

import { UserService } from '$app/user/user.service';

export class UserTest {
	static counter = 0;

	static get username(): string {
		const username = `user${this.counter}`;
		this.counter++;
		return username;
	}
}

export const createUser = async (
	service: UserService,
	username: string,
): Promise<UserService> => {
	let user: UserService;
	try {
		user = service.new({
			firstName: 'firstname',
			lastName: 'lastname',
			email: `${username}@example.fr`,
			username,
			hashPassword: UserService.passwordToHash('Password42@'),
		});
		await user.update();
		return user;
	} catch (error) {
		throw new Error(`Error creating user: ${error}`);
	}
};

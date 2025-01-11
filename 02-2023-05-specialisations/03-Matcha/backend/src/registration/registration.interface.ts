export interface IregistrationUserBody {
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	password: string;
}

export interface IregistrationUserReturn {
	message: string;
}

export interface IgetErrorBodyReturn {
	email?: string[];
	username?: string[];
	firstName?: string[];
	lastName?: string[];
	password?: string[];
}

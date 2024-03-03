export enum UpdateChannelOperator {
	ADD_USER = "ADD_USER",
	REMOVE_USER = "REMOVE_USER",
	BAN_USER = "BAN_USER",
	MUTE_USER = "MUTE_USER",
	CHANGE_PASSWORD = "CHANGE_PASSWORD",
	ADD_ADMIN = "ADD_ADMIN",
	REMOVE_ADMIN = "REMOVE_ADMIN",
	REVOKE_BAN = "REVOKE_BAN",
	REVOKE_MUTE = "REVOKE_MUTE"
}

export class UpdateChannelDto {
	operation: UpdateChannelOperator;
	parameter: any;
	parameter_2: Date;
}
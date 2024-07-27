export interface Message {
	message: string;
	username: string | undefined;
	me?: boolean;
	system?: boolean;
}

/* eslint-disable @typescript-eslint/naming-convention */
export enum LogTypeEnum {
	ERROR,
	WARN,
	INFO,
	DEBUG,
}
export type LogType = keyof typeof LogTypeEnum;
export interface Log {
	type: LogType;
	timestamp: Date;
	value: string;
}

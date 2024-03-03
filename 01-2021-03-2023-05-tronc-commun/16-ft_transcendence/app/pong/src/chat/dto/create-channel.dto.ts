import { ChannelType } from '@prisma/client';

export class CreateChannelDto {
	name: string;
	users: number[];
	visibility: ChannelType;
	password: string | null;
  }
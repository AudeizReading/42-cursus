import { ApiProperty } from '@nestjs/swagger';

export class OauthInformation {
	@ApiProperty({
		examples: ['Google', 'Facebook'],
	})
	name: string;
	@ApiProperty()
	url: string;
}

export class OauthInformationDto {
	@ApiProperty({ required: false })
	createUser?: string = 'true';
}

export class CodeDto {
	@ApiProperty()
	code: string;
	@ApiProperty({ required: false })
	state?: string;
}

export class LinkOauthDto {
	@ApiProperty()
	idProvider: string;
}

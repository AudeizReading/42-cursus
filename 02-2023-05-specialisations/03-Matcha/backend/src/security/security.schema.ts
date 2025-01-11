import { ApiProperty } from '@nestjs/swagger';

interface Error {
	statusCode: number;
	error: string;
	message: string;
}

export class BadRequestResponse implements Error {
	@ApiProperty({
		example: 400,
	})
	statusCode: number;
	@ApiProperty({
		example: 'Bad Request',
	})
	error: string;
	@ApiProperty()
	message: string;
}

export class UnauthorizedResponse implements Error {
	@ApiProperty({
		example: 401,
	})
	statusCode: number;
	@ApiProperty({
		example: 'Unauthorized',
	})
	error: string;
	@ApiProperty()
	message: string;
}

export class NotFoundResponse implements Error {
	@ApiProperty({
		example: 404,
	})
	statusCode: number;
	@ApiProperty({
		example: 'Not Found',
	})
	error: string;
	@ApiProperty()
	message: string;
}

export class ConflictResponse implements Error {
	@ApiProperty({
		example: 409,
	})
	statusCode: number;
	@ApiProperty({
		example: 'Conflict',
	})
	error: string;
	@ApiProperty()
	message: string;
}

export class GoneResponse implements Error {
	@ApiProperty({
		example: 410,
	})
	statusCode: number;
	@ApiProperty({
		example: 'Gone',
	})
	error: string;
	@ApiProperty()
	message: string;
}

export class ForbiddenResponse implements Error {
	@ApiProperty({
		example: 403,
	})
	statusCode: number;
	@ApiProperty({
		example: 'Forbidden',
	})
	error: string;
	@ApiProperty()
	message: string;
}

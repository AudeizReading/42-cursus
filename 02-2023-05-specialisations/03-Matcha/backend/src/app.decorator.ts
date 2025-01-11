import { Controller as ControllerJest } from '@nestjs/common';
import { ApiResponseMetadata, ApiTags } from '@nestjs/swagger';
import {
	BadRequestResponse,
	ConflictResponse,
	GoneResponse,
	UnauthorizedResponse,
	NotFoundResponse,
	ForbiddenResponse,
} from './security/security.schema';
import {
	ApiBadRequestResponse as ApiBadRequestResponseSwagger,
	ApiOkResponse as ApiOkResponseSwagger,
	ApiUnauthorizedResponse as ApiUnauthorizedResponseSwagger,
	ApiCreatedResponse as ApiCreatedResponseSwagger,
	ApiConflictResponse as ApiConflictResponseSwagger,
	ApiGoneResponse as ApiGoneResponseSwagger,
	ApiNotFoundResponse as ApiNotFoundResponseSwagger,
	ApiForbiddenResponse as ApiForbiddenResponseSwagger,
} from '@nestjs/swagger';

export const Controller = (name: string): ClassDecorator => {
	return <ClassDecorator>(target: ClassDecorator): void => {
		ApiTags(
			`${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`,
			'All',
		)(target as () => void);
		ControllerJest(name)(target as () => void);
	};
};

export const ApiOkResponse = (
	options?: ApiResponseMetadata,
): MethodDecorator => {
	options = options || {};
	if (options?.description == undefined) options.description = 'Ok';
	return ApiOkResponseSwagger(options);
};

export const ApiCreatedResponse = (
	options?: ApiResponseMetadata,
): MethodDecorator => {
	options = options || {};
	if (options?.description == undefined) options.description = 'Created';
	return ApiCreatedResponseSwagger(options);
};

export const ApiConflictResponse = (
	options?: ApiResponseMetadata,
): MethodDecorator => {
	options = options || {};
	if (options?.description == undefined) options.description = 'Conflict';
	if (options?.type == undefined) options.type = ConflictResponse;
	return ApiConflictResponseSwagger(options);
};

export const ApiUnauthorizedResponse = (
	options?: ApiResponseMetadata,
): MethodDecorator => {
	options = options || {};
	if (options?.description == undefined) options.description = 'Unauthorized';
	if (options?.type == undefined) options.type = UnauthorizedResponse;
	return ApiUnauthorizedResponseSwagger(options);
};

export const ApiBadRequestResponse = (
	options?: ApiResponseMetadata,
): MethodDecorator => {
	options = options || {};
	if (options?.description == undefined) options.description = 'Bad Request';
	if (options?.type == undefined) options.type = BadRequestResponse;
	return ApiBadRequestResponseSwagger(options);
};

export const ApiGoneResponse = (
	options?: ApiResponseMetadata,
): MethodDecorator => {
	options = options || {};
	if (options?.description == undefined) options.description = 'Gone';
	if (options?.type == undefined) options.type = GoneResponse;
	return ApiGoneResponseSwagger(options);
};

export const ApiNotFoundResponse = (
	options?: ApiResponseMetadata,
): MethodDecorator => {
	options = options || {};
	if (options?.description == undefined) options.description = 'Not Found';
	if (options?.type == undefined) options.type = NotFoundResponse;
	return ApiNotFoundResponseSwagger(options);
};

export const ApiForbiddenResponse = (
	options?: ApiResponseMetadata,
): MethodDecorator => {
	options = options || {};
	if (options?.description == undefined) options.description = 'Forbidden';
	if (options?.type == undefined) options.type = ForbiddenResponse;
	return ApiForbiddenResponseSwagger(options);
};

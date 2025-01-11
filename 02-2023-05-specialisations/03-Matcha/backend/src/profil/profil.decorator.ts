import { ApiOperation } from '@nestjs/swagger';
import { OkResponseMe, ProfileIsCompletteResponse } from './profil.schema';
import {
	ApiConflictResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
} from '$app/app.decorator';
import { UserPublic } from '$app/user/user.interface';

type Route =
	| 'me'
	| 'publicUser'
	| 'viewUser'
	| 'likeUser'
	| 'unlikeUser'
	| 'reportUser'
	| 'blockUser'
	| 'isComplette'
	| 'dislikeUser'
	| 'unblockUser';

const me = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: [
			'Retrieves user information, and a valid JWT in the header is ',
			'required for authentication.',
		].join(''),
		description: [
			'The GET route /api/profile/me is designed to retrieve user ',
			'information. To access this endpoint, clients must include a ',
			'valid JWT (JSON Web Token) in the header of the request for ',
			'authentication purposes. The server processes the request, ',
			'verifies the provided JWT, and if authentication is successful, ',
			"it responds by sending the user's information.",
			'\n\n',
			'The user information typically includes details such as ',
			'username, email, profile data, or any other relevant information ',
			"associated with the authenticated user. It's crucial to implement",
			' proper security measures to protect against unauthorized access ',
			'and ensure the confidentiality of user data.',
			'\n\n',
			'In the case of an unsuccessful authentication attempt (invalid ',
			'or expired JWT), the route should return an appropriate error ',
			'message, informing the client about the need for a valid JWT. ',
			'Implementing this type of authentication for retrieving user ',
			'profiles enhances the security of user data and ensures that ',
			'only authenticated users can access their own information.',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseMe })(target, propertyKey, descriptor);
};

const publicUser = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get public profil user'].join(''),
		description: ['Get public profil user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: UserPublic })(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const viewUser = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Add view in user'].join(''),
		description: ['Add view in user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiConflictResponse()(target, propertyKey, descriptor);
	ApiForbiddenResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const likeUser = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Add like in user'].join(''),
		description: ['Add like in user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiConflictResponse()(target, propertyKey, descriptor);
	ApiForbiddenResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const dislikeUser = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Add dislike in user'].join(''),
		description: ['Add dislike in user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiConflictResponse()(target, propertyKey, descriptor);
	ApiForbiddenResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const unlikeUser = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['unlike user'].join(''),
		description: ['unlike user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const reportUser = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Report user'].join(''),
		description: ['Report user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiConflictResponse()(target, propertyKey, descriptor);
	ApiForbiddenResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const blockUser = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Block user'].join(''),
		description: ['Block user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiConflictResponse()(target, propertyKey, descriptor);
	ApiForbiddenResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const unblockUser = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Unblock user'].join(''),
		description: ['Unblock user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiConflictResponse()(target, propertyKey, descriptor);
	ApiForbiddenResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const isComplette = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['return empty field for complette profile'].join(''),
		description: ['return empty field for complette profile'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: ProfileIsCompletteResponse })(
		target,
		propertyKey,
		descriptor,
	);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'me':
			return me;
		case 'publicUser':
			return publicUser;
		case 'viewUser':
			return viewUser;
		case 'likeUser':
			return likeUser;
		case 'dislikeUser':
			return dislikeUser;
		case 'unlikeUser':
			return unlikeUser;
		case 'blockUser':
			return blockUser;
		case 'unblockUser':
			return unblockUser;
		case 'reportUser':
			return reportUser;
		case 'isComplette':
			return isComplette;
	}
};

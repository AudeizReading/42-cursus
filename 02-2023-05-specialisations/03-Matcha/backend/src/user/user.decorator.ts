import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
	BooleanStatusResponse,
	ChangePasswordByTokenBody,
	OkResponseChangePasswordByToken,
	SetDescriptionBody,
	SetGenderBody,
	SetSexualPreferenceBody,
	StatsResponse,
} from './user.schema';
import {
	ApiBadRequestResponse,
	ApiGoneResponse,
	ApiOkResponse,
} from '$app/app.decorator';
import { OkResponseMe } from '$app/profil/profil.schema';
import { UserPublic, UserPublicView } from './user.interface';

type Route =
	| 'setGender'
	| 'changePasswordByToken'
	| 'setDefaultPicture'
	| 'setDescription'
	| 'setSexualPreference'
	| 'update'
	| 'getView'
	| 'getVisitedView'
	| 'getLike'
	| 'getLiked'
	| 'getMatch'
	| 'setLocationType'
	| 'setBirthday'
	| 'likeId'
	| 'likedId'
	| 'visitedId'
	| 'viewId'
	| 'matchId'
	| 'stats';

const changePasswordByToken = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: [
			"Facilitates the change of a user's password using a token sent ",
			'via email and returns a JWT upon success.',
		].join(''),
		description: [
			'The PUT route /api/user/changePasswordByToken serves the purpose',
			' of allowing users to change their passwords securely by ',
			'utilizing a token sent through email. Clients should submit a ',
			'request to this endpoint, including the necessary parameters ',
			'such as the user token and the new password. The server ',
			"processes this information, validating the token's authenticity ",
			"and updating the user's password in the system.",
			'\n\n',
			'Upon successful password change, the route responds by issuing ',
			'a new JWT (JSON Web Token), providing a secure and authenticated ',
			'token for subsequent user interactions. This JWT can be used for ',
			'authorization in future requests, ensuring a seamless and ',
			'secure user experience. It is crucial to implement robust ',
			'security measures, such as token validation and user ',
			'authentication, to safeguard the password change process.',
			'\n\n',
			'In the event of any issues or failures, the route may return an ',
			'appropriate error message detailing the nature of the problem, ',
			'allowing clients to address the issue effectively. Users should ',
			'be informed about the successful password change through the ',
			'provided JWT, enhancing the overall user experience and security ',
			'of the application.',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({ type: ChangePasswordByTokenBody })(
		target,
		propertyKey,
		descriptor,
	);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
	ApiGoneResponse()(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseChangePasswordByToken })(
		target,
		propertyKey,
		descriptor,
	);
};

const setDefaultPicture = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Set default picture profile'].join(''),
		description: ['This route set default picture profile user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const setDescription = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Set description profile'].join(''),
		description: ['This route set description in profile user'].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({ type: SetDescriptionBody })(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const setGender = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Set gender profile'].join(''),
		description: ['This route set gender in profile user'].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({ type: SetGenderBody })(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const setSexualPreference = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Set gender profile'].join(''),
		description: ['This route set gender in profile user'].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({ type: SetSexualPreferenceBody })(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const update = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Update user profile complete'].join(''),
		description: ['This route update profile user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseMe })(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const getView = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get profile visited me'].join(''),
		description: ['Get profile visited me'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: [UserPublicView] })(target, propertyKey, descriptor);
};

const getVisitedView = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get profile visited'].join(''),
		description: ['Get profile visited'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: [UserPublicView] })(target, propertyKey, descriptor);
};

const getLike = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get profile like'].join(''),
		description: ['Profile who my liker'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: [UserPublic] })(target, propertyKey, descriptor);
};

const getLiked = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get profile liked'].join(''),
		description: ['Profile that I liked'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: [UserPublic] })(target, propertyKey, descriptor);
};

const getMatch = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get profile match'].join(''),
		description: ['Profile is Match'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: [UserPublic] })(target, propertyKey, descriptor);
};

const setLocationType = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Set Location type'].join(''),
		description: ['Valid value: IP, NAVIGATOR, FAKE'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const setBirthday = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Set Birthday'].join(''),
		description: ['Set Birthday'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const likeId = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Pour voir si le profil :id nous a liker'].join(''),
		description: ['Pour voir si le profil :id nous a liker'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: BooleanStatusResponse })(
		target,
		propertyKey,
		descriptor,
	);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const likedId = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Pour voir si on a liker le profil :id'].join(''),
		description: ['Pour voir si on a liker le profil :id'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: BooleanStatusResponse })(
		target,
		propertyKey,
		descriptor,
	);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const matchId = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Pour voir si on match le profil :id'].join(''),
		description: ['Pour voir si on match le profil :id'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: BooleanStatusResponse })(
		target,
		propertyKey,
		descriptor,
	);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const viewId = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Pour voir si le profil :id nous a deja vu'].join(''),
		description: ['Pour voir si le profil :id nous a deja vu'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: BooleanStatusResponse })(
		target,
		propertyKey,
		descriptor,
	);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const visitedId = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Pour voir si on a deja vu le profil :id'].join(''),
		description: ['Pour voir si on a deja vu le profil :id'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: BooleanStatusResponse })(
		target,
		propertyKey,
		descriptor,
	);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const stats = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get stats user'].join(''),
		description: ['Get stats user'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: StatsResponse })(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'changePasswordByToken':
			return changePasswordByToken;
		case 'setDefaultPicture':
			return setDefaultPicture;
		case 'setDescription':
			return setDescription;
		case 'setGender':
			return setGender;
		case 'setSexualPreference':
			return setSexualPreference;
		case 'update':
			return update;
		case 'getView':
			return getView;
		case 'getVisitedView':
			return getVisitedView;
		case 'getLike':
			return getLike;
		case 'getLiked':
			return getLiked;
		case 'getMatch':
			return getMatch;
		case 'setLocationType':
			return setLocationType;
		case 'setBirthday':
			return setBirthday;
		case 'likeId':
			return likeId;
		case 'likedId':
			return likedId;
		case 'matchId':
			return matchId;
		case 'viewId':
			return viewId;
		case 'visitedId':
			return visitedId;
		case 'stats':
			return stats;
	}
};

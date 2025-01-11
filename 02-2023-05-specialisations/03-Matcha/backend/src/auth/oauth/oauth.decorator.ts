import { ApiOperation } from '@nestjs/swagger';
import { ApiBadRequestResponse, ApiOkResponse } from '$app/app.decorator';
import { OauthInformation } from './oauth.schema';

type Route = 'getOauthInformations' | 'google' | 'facebook' | 'link' | 'unlink';

const getOauthInformations = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get oauth information'].join(''),
		description: ['Get oauth information'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: [OauthInformation] })(
		target,
		propertyKey,
		descriptor,
	);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
};

const google = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Google'].join(''),
		description: ['Google'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const facebook = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Facebook'].join(''),
		description: ['Facebook'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const link = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Link provider oauth'].join(''),
		description: ['Link provider oauth'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const unlink = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Unlink provider oauth'].join(''),
		description: ['Unlink provider oauth'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'getOauthInformations':
			return getOauthInformations;
		case 'google':
			return google;
		case 'facebook':
			return facebook;
		case 'link':
			return link;
		case 'unlink':
			return unlink;
	}
};

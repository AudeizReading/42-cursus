import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { DeleteTag, GetTagReturn, PostTag, TagOkReturn } from './tag.schema';
import { ApiOkResponse, ApiBadRequestResponse } from '$app/app.decorator';

type Route = 'getTag' | 'postTag' | 'deleteTag';

const getTag = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Retrieve Existing Tags'].join(''),
		description: [
			'This API, accessible through the route /api/tag, allows you to ',
			'retrieve a list of existing tags. It accepts three optional query ',
			'parameters: limit (limits the number of results per page), page ',
			'(indicates the page to display), and search (filters the results ',
			'based on search criteria).',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: GetTagReturn })(target, propertyKey, descriptor);
};

const postTag = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Add tag user'].join(''),
		description: [
			'This endpoint allows the connected user to add a new tag.',
			'The user submits the details of the tag to add, such as its name, ',
			'color, etc., and upon successful POST request, the tag is added to ',
			"the user's list of tags.",
		].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: TagOkReturn })(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
	ApiBody({ type: PostTag })(target, propertyKey, descriptor);
};

const deleteTag = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Delete tag user'].join(''),
		description: [
			'This endpoint enables the connected user to delete an existing tag.',
			'The user submits the identifier of the tag to delete, and upon ',
			'successful DELETE request, the corresponding tag is removed from ',
			"the user's list of tags.",
		].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: TagOkReturn })(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
	ApiBody({ type: DeleteTag })(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'getTag':
			return getTag;
		case 'postTag':
			return postTag;
		case 'deleteTag':
			return deleteTag;
	}
};

import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import {
	ApiOkResponse,
	ApiNotFoundResponse,
	ApiCreatedResponse,
} from '$app/app.decorator';
import { OkResponseGetFileInfo } from './file.schema';

type Route =
	| 'getFile'
	| 'getInfoFile'
	| 'addPictureProfil'
	| 'deleteMediaUserById'
	| 'deleteMediaUserByName'
	| 'sendVideoToChat'
	| 'sendAudioToChat'
	| 'sendPictureToChat'
	| 'addPictureToEvent';

const getFile = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Retrieve File by ID'].join(''),
		description: [
			'This GET route allows users to retrieve a specific file by its ',
			'unique identifier (:uuid) within the API. By using this endpoint, ',
			'users can access the content of the file corresponding to the ',
			'provided identifier, facilitating file manipulation and management',
			' within the application.',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const getInfoFile = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Retrieve File Information by ID'].join(''),
		description: [
			'This GET endpoint enables users to fetch detailed information ',
			'about a specific file identified by its unique identifier (:uuid) ',
			'within the API. By accessing this route, users can obtain metadata',
			' and attributes associated with the file corresponding to the ',
			'provided identifier, aiding in the comprehensive management and ',
			'utilization of files within the application.',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseGetFileInfo })(
		target,
		propertyKey,
		descriptor,
	);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const addPictureProfil = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Profile Picture Upload API Endpoint'].join(''),
		description: [
			'The POST /api/file/profil route allows users to add ',
			'a picture to their profil. By utilizing this API, ',
			'users can upload an image in the request body, which ',
			'will then be associated with their profile. This ',
			'feature enhances user customization of profiles, ',
			'thereby enriching the user experience and interaction ',
			'on the platform.',
		].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({
		required: true,
		type: 'multipart/form-data',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})(target, propertyKey, descriptor);
	ApiCreatedResponse({ type: OkResponseGetFileInfo })(
		target,
		propertyKey,
		descriptor,
	);
	ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
};

const deleteMediaUserByName = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Delete media user by uuid'].join(''),
		description: ['This route delete media user by uuid'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const deleteMediaUserById = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Delete media user by id'].join(''),
		description: ['This route delete media user by id'].join(''),
	})(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
	ApiNotFoundResponse()(target, propertyKey, descriptor);
};

const sendAudioToChat = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Send audio to chat'].join(''),
		description: ['Send Audio to chat'].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({
		required: true,
		type: 'multipart/form-data',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
				userId: {
					type: 'number',
				},
			},
		},
	})(target, propertyKey, descriptor);
	ApiCreatedResponse({ type: OkResponseGetFileInfo })(
		target,
		propertyKey,
		descriptor,
	);
	ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
};

const sendPictureToChat = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Send picture to chat'].join(''),
		description: ['Send picture to chat'].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({
		required: true,
		type: 'multipart/form-data',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
				userId: {
					type: 'number',
				},
			},
		},
	})(target, propertyKey, descriptor);
	ApiCreatedResponse({ type: OkResponseGetFileInfo })(
		target,
		propertyKey,
		descriptor,
	);
	ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
};

const sendVideoToChat = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Send video to chat'].join(''),
		description: ['Send Video to chat'].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({
		required: true,
		type: 'multipart/form-data',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
				userId: {
					type: 'number',
				},
			},
		},
	})(target, propertyKey, descriptor);
	ApiCreatedResponse({ type: OkResponseGetFileInfo })(
		target,
		propertyKey,
		descriptor,
	);
	ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
};

const addPictureToEvent = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Add picture for event'].join(''),
		description: ['Add picture for event'].join(''),
	})(target, propertyKey, descriptor);
	ApiBody({
		required: true,
		type: 'multipart/form-data',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})(target, propertyKey, descriptor);
	ApiCreatedResponse({ type: OkResponseGetFileInfo })(
		target,
		propertyKey,
		descriptor,
	);
	ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'getFile':
			return getFile;
		case 'getInfoFile':
			return getInfoFile;
		case 'addPictureProfil':
			return addPictureProfil;
		case 'deleteMediaUserByName':
			return deleteMediaUserByName;
		case 'deleteMediaUserById':
			return deleteMediaUserById;
		case 'sendAudioToChat':
			return sendAudioToChat;
		case 'sendPictureToChat':
			return sendPictureToChat;
		case 'sendVideoToChat':
			return sendVideoToChat;
		case 'addPictureToEvent':
			return addPictureToEvent;
	}
};

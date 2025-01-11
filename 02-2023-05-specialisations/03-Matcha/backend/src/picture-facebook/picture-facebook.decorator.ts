import { ApiOperation } from '@nestjs/swagger';
import {
	ApiBadRequestResponse,
	ApiForbiddenResponse,
	ApiOkResponse,
} from '$app/app.decorator';
import { DataPictureFacebook } from './picture-facebook.schema';
import { OkResponseGetFileInfo } from '$app/file/file.schema';

type Route = 'rightReadPictureFacebook' | 'getPicture' | 'addPictureInProfil';

const rightReadPictureFacebook = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get right import picture for facebook'].join(''),
		description: ['Get right import picture for facebook'].join(''),
	})(target, propertyKey, descriptor);
	ApiForbiddenResponse()(target, propertyKey, descriptor);
	ApiOkResponse()(target, propertyKey, descriptor);
};

const getPicture = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Get picture facebook'].join(''),
		description: ['Get picture facebook'].join(''),
	})(target, propertyKey, descriptor);
	ApiForbiddenResponse()(target, propertyKey, descriptor);
	ApiOkResponse({ type: DataPictureFacebook })(
		target,
		propertyKey,
		descriptor,
	);
};

const addPictureInProfil = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiOperation({
		summary: ['Add picture facebook in profil'].join(''),
		description: ['Add picture facebook in profil'].join(''),
	})(target, propertyKey, descriptor);
	ApiForbiddenResponse()(target, propertyKey, descriptor);
	ApiBadRequestResponse()(target, propertyKey, descriptor);
	ApiOkResponse({ type: OkResponseGetFileInfo })(
		target,
		propertyKey,
		descriptor,
	);
};

export const Api = (name: Route): MethodDecorator => {
	switch (name) {
		case 'rightReadPictureFacebook':
			return rightReadPictureFacebook;
		case 'getPicture':
			return getPicture;
		case 'addPictureInProfil':
			return addPictureInProfil;
	}
};

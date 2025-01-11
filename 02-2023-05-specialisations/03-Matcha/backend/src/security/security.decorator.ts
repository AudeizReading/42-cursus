import { UseGuards as UseGuardsNest } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { NotAuthGuard } from './notAuth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '$app/app.decorator';
import { ProfilCompletedGuard } from './profilCompleted.guard';

type Guard = 'auth' | 'notAuth' | 'profilCompleted';

const profilCompleted = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiTags('Required Authentification And Profile Completed')(
		target,
		propertyKey,
		descriptor,
	);
	ApiTags('Required Authentification')(target, propertyKey, descriptor);
	ApiBearerAuth('JWT-auth')(target, propertyKey, descriptor);
	ApiUnauthorizedResponse()(target, propertyKey, descriptor);
	UseGuardsNest(ProfilCompletedGuard)(target, propertyKey, descriptor);
};

const auth = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiTags('Required Authentification Not Profile Completed Required')(
		target,
		propertyKey,
		descriptor,
	);
	ApiTags('Required Authentification')(target, propertyKey, descriptor);
	ApiBearerAuth('JWT-auth')(target, propertyKey, descriptor);
	ApiUnauthorizedResponse()(target, propertyKey, descriptor);
	UseGuardsNest(AuthGuard)(target, propertyKey, descriptor);
};

const notAuth = (
	target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): void => {
	ApiTags('Public')(target, propertyKey, descriptor);
	ApiUnauthorizedResponse()(target, propertyKey, descriptor);
	UseGuardsNest(NotAuthGuard)(target, propertyKey, descriptor);
};

export const UseGuards = (name: Guard): MethodDecorator => {
	switch (name) {
		case 'auth':
			return auth;
		case 'notAuth':
			return notAuth;
		case 'profilCompleted':
			return profilCompleted;
	}
};

import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiBody, ApiQuery, CoordinatesDTO, LocationAddressDTO, UserLocationTypeDTO } from '@app/models';
import { ApiService, LoggerService } from '@app/shared';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class LocationService {
	public constructor(
		private apiService: ApiService,
		private logger: LoggerService,
	) {}

	public getLocation(
		latitude: number,
		longitude: number,
	): Observable<LocationAddressDTO | HttpResponse<LocationAddressDTO>> {
		try {
			return this.apiService.get<ApiQuery, ApiBody>('v1.location.endpoint', {
				params: `${latitude}/${longitude}`,
			}) as Observable<LocationAddressDTO | HttpResponse<LocationAddressDTO>>;
		} catch (error) {
			this.logger.handleError<unknown>(`latitude: ${latitude}, longitude: ${longitude}`, null);
		}
		return of(null) as unknown as Observable<LocationAddressDTO | HttpResponse<LocationAddressDTO>>;
	}

	public updateFakeLocation(latitude: number, longitude: number): Observable<unknown> {
		try {
			return this.apiService.put<ApiQuery, CoordinatesDTO>('v1.location.fake', {
				body: { latitude, longitude },
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`latitude: ${latitude}, longitude: ${longitude}`, null);
		}
		return of(null) as unknown as Observable<unknown>;
	}

	public updateIpTypeLocation(): Observable<unknown> {
		try {
			return this.apiService.put<ApiQuery, UserLocationTypeDTO>('v1.user.locationType', {
				body: { locationType: 'IP' },
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`location Type: IP`, null);
		}
		return of(null) as unknown as Observable<unknown>;
	}

	public updateNavigatorLocation(latitude: number, longitude: number): Observable<unknown> {
		try {
			return this.apiService.put<ApiQuery, CoordinatesDTO>('v1.location.navigator', {
				body: { latitude, longitude },
			}) as Observable<unknown>;
		} catch (error) {
			this.logger.handleError<unknown>(`latitude: ${latitude}, longitude: ${longitude}`, null);
		}
		return of(null) as unknown as Observable<unknown>;
	}
}

import { LocationService } from '@app/shared';
import { createLocationDTO, LocationAddressDTO, LocationUpdateDTO } from '.';
import { FileDTO } from './file';
import { ProfileDTO } from './profile';
import { forkJoin, map, Observable, of } from 'rxjs';
import { ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface EventResponseDTO {
	id: number;
	location: { latitude: number; longitude: number };
	user: ProfileDTO;
	match: ProfileDTO;
	datetime: Date;
	name: string;
	description: string;
	file: FileDTO;
	status: string;
}

export interface EventMacha extends EventResponseDTO {
	settings: LocationUpdateDTO;
}

export interface EventsResponseDTO {
	results: EventResponseDTO[];
	limit: number;
	currentPage: number;
}

export interface EventBodyDTO {
	location?: { latitude: number; longitude: number };
	matchId: number;
	datetime: string;
	name: string;
	description: string;
	fileId?: number;
}

export class EventsMatcha {
	protected list: EventMacha[] = [];
	protected currentPage: number = 0;

	public constructor(
		init: EventsResponseDTO,
		private locationService: LocationService,
		private cdr: ChangeDetectorRef,
		private destroyRef: DestroyRef,
	) {
		this.events = init.results;
		this.currentPage = init.currentPage;
	}

	public decorateEventsWithSettings(): Observable<EventMacha[]> {
		const enrichedEvents$ = this.list.map((event) => {
			if (
				event.location?.latitude &&
				event.location?.longitude &&
				(event.location.latitude !== -1 || event.location.longitude !== -1)
			) {
				return this.locationService.getLocation(event.location.latitude, event.location.longitude).pipe(
					takeUntilDestroyed(this.destroyRef),
					map((response) => {
						const location = response as LocationAddressDTO;
						const address = location.address;

						return {
							...event,
							settings: new LocationUpdateDTO({
								city: address.city,
								state: address.state,
								countryName: address.countryName,
								...createLocationDTO({
									latitude: event.location.latitude,
									longitude: event.location.longitude,
									userId: event.user.id,
									type: 'FAKE',
								}),
							}),
						};
					}),
				);
			} else {
				return of(this.transformToEventMacha(event));
			}
		});

		// Combine tous les Observables en un seul.
		return forkJoin(enrichedEvents$).pipe(
			map((decoratedEvents) => {
				this.list = decoratedEvents; // Mets à jour la liste locale.
				return this.list;
			}),
		);
	}

	public get page(): number {
		return this.currentPage;
	}
	public set page(page: number) {
		this.currentPage = page;
	}

	public get events(): EventMacha[] {
		return this.list;
	}

	private transformToEventMacha(event: EventResponseDTO): EventMacha {
		return {
			...event,
			settings: new LocationUpdateDTO({
				city: '',
				state: '',
				countryName: '',
				...createLocationDTO({
					latitude: event.location?.latitude ?? -1,
					longitude: event.location?.longitude ?? -1,
					userId: event.user.id,
					type: 'FAKE',
				}),
			}),
		};
	}

	public set events(events: EventResponseDTO[]) {
		const eventsMacha = events.map((event) => this.transformToEventMacha(event));
		this.list = eventsMacha;
		this.decorateEventsWithSettings()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: () => {
					this.cdr.markForCheck();
				},
			});
	}

	public add(events: EventResponseDTO[]): void {
		const decoratedEvents = events.map((event) => this.transformToEventMacha(event));
		this.list = [...this.list, ...decoratedEvents];
		this.decorateEventsWithSettings()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: () => {
					this.cdr.markForCheck();
				},
			});
	}

	public find(id: number): EventMacha | undefined {
		return this.list.find((event) => event.id === id);
	}

	public static create(datas?: Partial<EventBodyDTO>): EventBodyDTO {
		return {
			matchId: 0,
			datetime: '',
			name: '',
			description: '',
			...datas,
		};
	}

	public remove(id: number): void {
		this.list = this.list.filter((event) => event.id !== id);
	}
}

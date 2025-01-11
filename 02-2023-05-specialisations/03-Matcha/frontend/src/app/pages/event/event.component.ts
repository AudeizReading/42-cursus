import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	OnInit,
	ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	AlertFacade,
	CardProfileHistory,
	createLocationDTO,
	EventBodyDTO,
	EventMacha,
	EventsMatcha,
	EventsResponseDTO,
	FileDTO,
	LeafletCoordinatesDTO,
	LocationAddressDTO,
	LocationUpdateDTO,
	Profile,
	ProfileDTO,
	UserHistory,
	UserHistoryCard,
} from '@app/models';
import {
	AlertService,
	EventService,
	LocationService,
	NotifService,
	ProfileService,
	UserHistoryService,
} from '@app/shared';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { LayoutComponent } from '@app/layout';
import {
	FakeLocationDialogComponent,
	FooterActionComponent,
	HeaderActionComponent,
	TextareaComponent,
} from '@app/components';
import { filter, Observable, of, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputIconComponent } from '../../components/input-icon/input-icon.component';
import { HttpResponse } from '@angular/common/http';
import { TrashComponent } from '@app/components/icons/trash/trash.component';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
	selector: 'app-event',
	standalone: true,
	imports: [
		LoaderComponent,
		CommonModule,
		DatePipe,
		LayoutComponent,
		HeaderActionComponent,
		FooterActionComponent,
		TextareaComponent,
		FakeLocationDialogComponent,
		ReactiveFormsModule,
		InputIconComponent,
		TrashComponent,
	],
	templateUrl: './event.component.html',
	styleUrl: './event.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent extends AlertFacade implements OnInit {
	protected profile!: Profile;
	private destroyRef: DestroyRef = inject(DestroyRef);
	private state!: RouterStateSnapshot;

	protected events!: EventsMatcha;
	protected history!: UserHistoryCard;

	protected limit: number = 5;
	protected page: number = 0;
	protected loading: boolean = true;

	protected loadPicture: boolean = false;
	protected inputFile: FileDTO | undefined = undefined;
	protected settings!: LocationUpdateDTO;
	protected activeTab: string = 'creation';
	protected backTo: string = '';
	protected matchId: number = -1;
	protected backName: string = 'Browsing';

	@ViewChild('descriptionTextArea') public descriptionTextArea!: TextareaComponent;

	protected form: FormGroup = this.formBuilder.group(
		{
			location: [''],
			matchId: ['', Validators.required],
			datetime: ['', Validators.required],
			name: ['', Validators.required],
			description: ['', Validators.required],
			fileId: [''],
		},
		{ updateOn: 'blur' },
	);

	public constructor(
		private profileService: ProfileService,
		private eventService: EventService,
		private historyService: UserHistoryService,
		private changeDetector: ChangeDetectorRef,
		private locationService: LocationService,
		private notifService: NotifService,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		protected router: Router,
		alertService: AlertService,
	) {
		super(alertService);
		this.state = this.router.routerState.snapshot;
		this.suscribeToSocketNotifs();
	}

	// Met a jour les events et les matchs a inviter en fonction des notifs
	private suscribeToSocketNotifs(): void {
		this.notifService.notif$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				filter(
					(payload) =>
						payload?.type?.includes('EVENT') || payload?.type === 'MATCH' || payload?.type === 'UNLIKE',
				),
			)
			.subscribe({
				next: (payload) => {
					const { type, fromUser } = payload;

					if (!payload || !type || !fromUser) {
						return;
					}
					const old = this.limit;
					this.limit = this.limit * (this.page + 1);
					this.page = 0;
					if (payload?.type?.includes('EVENT')) {
						this.fetchEvents()
							.pipe(takeUntilDestroyed(this.destroyRef))
							.subscribe({
								next: (payload) => {
									this.events = new EventsMatcha(
										payload,
										this.locationService,
										this.changeDetector,
										this.destroyRef,
									);

									this.events.page = this.page = payload.currentPage + 1;
									this.limit = old;
								},
							});
					} else if (payload?.type === 'MATCH' || payload?.type === 'UNLIKE') {
						this.firstMatchId$
							.pipe(
								takeUntilDestroyed(this.destroyRef),
								switchMap((matchId) => {
									if (!matchId.includes('-1')) {
										this.configureEventFormWithUserProfileAndFirstMatch(matchId);
									}
									return this.fetchEvents();
								}),
							)
							.subscribe({
								next: (payload) => {
									this.events = new EventsMatcha(
										payload,
										this.locationService,
										this.changeDetector,
										this.destroyRef,
									);

									this.events.page = this.page = payload.currentPage + 1;
									this.limit = old;
								},
							});
					}
				},
			});
	}

	public ngOnInit(): void {
		this.backTo = this.router.lastSuccessfulNavigation?.extras.state?.['previousUrl']
			? this.router.lastSuccessfulNavigation?.extras.state?.['previousUrl']
			: '/';

		if (/^\/chat\/conversation\/.*$/.test(this.backTo)) {
			this.backName = 'Conversation';
		} else if (/^\/profile\/.*$/.test(this.backTo)) {
			this.backName = 'Profile';
		}

		this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
			this.activeTab = params['tab'] ? params['tab'].toString() : 'creation';
			this.matchId = params['matchId'] ? parseInt(params['matchId'].toString()) : -1;
		});

		this.profileService
			.getProfile()
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				switchMap((profile) => {
					this.configureUserProfile(profile);

					return this.firstMatchId$;
				}),
				switchMap((matchId) => {
					if (!matchId.includes('-1')) {
						this.configureEventFormWithUserProfileAndFirstMatch(matchId);
					}
					return this.fetchEvents();
				}),
			)
			.subscribe({
				next: (payload) => {
					this.addEvents(payload);
				},
				error: (payload) => {
					this.alert('error', payload.message);
				},
			});
	}

	private configureUserProfile(profile: ProfileDTO): void {
		this.profile = new Profile(profile);
		this.settings = new LocationUpdateDTO({
			city: '',
			state: '',
			countryName: '',
			...createLocationDTO({ ...this.coords, userId: this.profile.id, type: 'FAKE' }),
		});
		this.getCityDatas();
	}

	private configureEventFormWithUserProfileAndFirstMatch(matchId: string): void {
		this.form = this.formBuilder.group(
			{
				location: [
					this.profile.coords && this.profile.coords.latitude && this.profile.coords.longitude
						? this.profile.coords
						: '',
				],
				fileId: [''],
				matchId: [matchId, Validators.required],
				datetime: [formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en'), Validators.required],
				description: ['', Validators.required],
				name: ['', Validators.required],
			},
			{ updateOn: 'blur' },
		);
	}

	private get firstMatchId(): string {
		//Si this.matchId !== -1, c'est qu'on vient d'une conversation
		return String(
			this.history.matchers.length > 0 ? (this.matchId !== -1 ? this.matchId : this.history.matchers[0].id) : -1,
		);
	}

	private get firstMatchId$(): Observable<string> {
		return this.historyService.getLastHistory(50).pipe(
			switchMap((history) => {
				this.history = new UserHistoryCard(history);
				return of(this.firstMatchId);
			}),
		);
	}

	protected isMatchSelected(id: string): number {
		return this.form.get('matchId')?.value === parseInt(id) ? 1 : 0;
	}

	protected onTabChange(tabname: string): void {
		this.activeTab = tabname;
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { tab: tabname },
			state: {
				previousUrl: this.router.url,
				currentUrl: this.state.url,
				code: 200,
				status: 'OK',
				message: 'Authorized',
			},
		});
	}

	protected fetchEvents(): Observable<EventsResponseDTO> {
		return this.eventService.getEvent(this.limit, this.page).pipe(takeUntilDestroyed(this.destroyRef));
	}

	private getLastNodeBeforeScroll(childNodes: NodeListOf<ChildNode>): HTMLDivElement | null {
		return Array.from(childNodes)
			.reverse()
			.find((node) => node.nodeType === 1) as HTMLDivElement | null;
	}

	protected canScroll(e: Event): boolean {
		const elm = e.target as HTMLDivElement;

		const nodes = elm.childNodes;
		if (!nodes) return false; // should never happen
		const antePenult = this.getLastNodeBeforeScroll(nodes);

		if (antePenult?.getBoundingClientRect()) {
			const computePercentScroll = (scroll: number, height: number, clientHeight: number): number => {
				return scroll / (height - clientHeight);
			};

			if (computePercentScroll(elm.scrollTop, elm.scrollHeight, elm.clientHeight) > 0.83) {
				return true;
			}
		}
		return false;
	}

	protected onScrollEvents(e: Event): void {
		if (this.canScroll(e) && !this.loading && this.events && this.events.page !== -1) {
			this.loading = true;
			this.changeDetector.detectChanges();
			this.fetchEvents()
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({ next: this.addEvents.bind(this) });
		}
	}

	protected onScrollMatches(e: Event): void {
		if (this.canScroll(e)) {
			this.fetchMatches()
				?.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({ next: this.addHistory.bind(this) });
		}
	}

	protected fetchMatches(): Observable<UserHistory | null> {
		if (this.history.pages.matches !== -1 && !this.loading) {
			this.loading = true;
			this.changeDetector.detectChanges();
			return this.historyService.fetchFollowingViews(this.history, 50, this.history.pages.matches);
		}
		return of(null);
	}

	protected get matches(): CardProfileHistory[] {
		return Array.isArray(this.history?.matchersCards) ? this.history.matchersCards : ([] as CardProfileHistory[]);
	}

	private addEvents(event: EventsResponseDTO): void {
		if (event.results.length > 0) {
			if (this.events) {
				this.events.add(event.results);
			} else {
				this.events = new EventsMatcha(event, this.locationService, this.changeDetector, this.destroyRef);
			}
			this.events.page = this.page = event.currentPage + 1;
		}
		this.loading = false;
		this.changeDetector.detectChanges();
	}

	private addHistory(history: UserHistory | null): void {
		if (history) {
			this.history = new UserHistoryCard(history.clone());
			if (this.history.matchers.find((matcher) => matcher.id === this.matchId)) {
				this.form.patchValue({ matchId: this.matchId.toString() });
			}
			this.loading = false;
			this.changeDetector.detectChanges();
		}
	}

	protected get list(): EventMacha[] {
		return this.events?.events ?? [];
	}

	protected get coords(): LeafletCoordinatesDTO {
		return {
			latitude: this.profile && this.profile.coords ? this.profile.coords.latitude : 43.71,
			longitude: this.profile && this.profile.coords ? this.profile.coords.longitude : 7.28,
			zoom: 4,
			type: 'FAKE',
		};
	}

	public onChangePicture(event: Event): void {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (files?.length == 1) {
			this.loadPicture = true;
			this.eventService
				.postEventFile(files[0])
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (event: HttpResponse<FileDTO>) => {
						if (event.body) {
							this.inputFile = event.body;
							const fileId = event.body.id;
							this.form.patchValue({ fileId });
							this.loadPicture = false;
							this.changeDetector.detectChanges();
						}
					},
					error: () => {
						this.loadPicture = false;
						this.changeDetector.detectChanges();
					},
				});
		}
	}

	public onRemovePicture(): void {
		this.inputFile = undefined;
		this.form.patchValue({ fileId: '' });
	}

	protected onLocationSelected(coords: LeafletCoordinatesDTO): void {
		this.settings.openFake = true;
		if (coords.latitude !== -1 && coords.longitude !== -1) {
			this.settings.update = { ...coords };
			this.form.patchValue({ location: coords });
			this.changeDetector.detectChanges();
			this.getCityDatas();
		}
	}

	public onRemoveLocation(): void {
		this.form.patchValue({ location: '' });
		this.settings = new LocationUpdateDTO({
			city: '',
			state: '',
			countryName: '',
			...createLocationDTO({ ...this.coords, userId: this.profile.id, type: 'FAKE' }),
		});
	}

	private getCityDatas(): void {
		this.locationService
			.getLocation(this.settings.latitude, this.settings.longitude)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (response) => {
					const location = response as LocationAddressDTO;
					const address = location.address;

					this.settings.context = {
						city: address.city,
						state: address.state,
						countryName: address.countryName,
					};
					this.changeDetector.detectChanges();
				},
				error: (error) => {
					this.alert('error', error.message);
				},
			});
	}

	protected onCreate(e: Event, datas?: Partial<EventBodyDTO>): void {
		e.preventDefault();
		if (this.form.valid) {
			this.eventService
				.postEvent(EventsMatcha.create({ ...this.form.value, ...datas }))
				.pipe(
					takeUntilDestroyed(this.destroyRef),
					switchMap((payload) => {
						if (payload instanceof HttpResponse) {
							return this.firstMatchId$.pipe(
								takeUntilDestroyed(this.destroyRef),
								switchMap(() => of(payload)),
							);
						} else {
							return of(payload);
						}
					}),
				)
				.subscribe({
					next: (payload) => {
						if (payload instanceof HttpResponse) {
							this.resetEventForm();

							const body = payload.body;
							if (body) this.events.add([body]);
							this.alert('success', 'Event created');
						}
					},
					error: (error) => {
						this.alert('error', error.error.message);
					},
				});
		} else if (this.form.invalid) {
			this.alert('error', 'Form is invalid');
		}
	}

	private findEvent(id: number): EventMacha | undefined {
		return this.events.find(id);
	}

	private resetEventForm(): void {
		this.form.patchValue({
			datetime: formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en'),
			emitEvent: false,
		});
		this.form.patchValue({ description: '', emitEvent: false });
		this.form.patchValue({ name: '', emitEvent: false });
		this.inputFile = undefined;
		this.form.patchValue({ fileId: '', emitEvent: false });
		this.form.patchValue({ matchId: this.firstMatchId, emitEvent: false });
	}

	protected onAccept(id: number): void {
		const event = this.findEvent(id);
		if (!event) {
			this.alert('error', 'Event not found');
			return;
		}
		this.eventService
			.answerEvent(id.toString(), 'accept')
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload) => {
					if (payload instanceof HttpResponse) {
						event.status = 'ACCEPTED';
						this.changeDetector.detectChanges();
						this.alert('success', 'Event accepted');
					}
				},
				error: (error) => {
					this.alert('error', error.error.message);
				},
			});
	}

	protected onDecline(id: number): void {
		const event = this.findEvent(id);
		if (!event) {
			this.alert('error', 'Event not found');
			return;
		}
		this.eventService
			.answerEvent(id.toString(), 'refuse')
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (payload) => {
					if (payload instanceof HttpResponse) {
						event.status = 'REFUSE';
						this.changeDetector.detectChanges();
						this.alert('success', 'Event declined');
					}
				},
				error: (error) => {
					this.alert('error', error.error.message);
				},
			});
	}
}

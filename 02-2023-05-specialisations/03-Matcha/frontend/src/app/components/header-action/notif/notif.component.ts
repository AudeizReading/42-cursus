import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { LoaderComponent } from '@app/components/loader/loader.component';
import { NotifcationCardComponent } from '@app/components/notification/card/card.component';
import { Notification } from '@app/models';

@Component({
	selector: 'app-notif',
	standalone: true,
	imports: [NotifcationCardComponent, LoaderComponent, CommonModule],
	templateUrl: './notif.component.html',
	styleUrl: './notif.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifComponent implements OnInit, OnChanges {
	@Input() public notifications: Notification[] = [];
	@Input() public canScroll: boolean = true;

	@Output() public actionNotif: EventEmitter<Notification> = new EventEmitter<Notification>();
	@Output() public deleteNotif: EventEmitter<Notification> = new EventEmitter<Notification>();
	@Output() public scrollNotif: EventEmitter<void> = new EventEmitter<void>();
	@Output() public setAsRead: EventEmitter<string[]> = new EventEmitter<string[]>();

	@ViewChild('notifs') public notifsContainer!: ElementRef<HTMLDivElement>;

	protected isLoading: boolean = true;
	protected isWaitingData: boolean = true;

	public constructor(private changeDetector: ChangeDetectorRef) {}

	public onDelete(notif: Notification): void {
		this.deleteNotif.emit(notif);
	}

	public onAction(notif: Notification): void {
		this.actionNotif.emit(notif);
	}

	public ngOnInit(): void {
		this.checkNotifications();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (
			changes['notifications'] &&
			changes['notifications'].currentValue !== changes['notifications'].previousValue
		) {
			this.isWaitingData = false;
			this.notifications = [...changes['notifications'].currentValue];
		}
		if (changes['canScroll'] && changes['canScroll'].currentValue !== changes['canScroll'].previousValue) {
			this.canScroll = changes['canScroll'].currentValue;
		}
		this.checkNotifications();
		this.searchVisibleNotifs();
	}

	private isNodeNotifNotReadVisible(node: HTMLElement): boolean {
		const elmCoords = this.notifsContainer.nativeElement.getBoundingClientRect();

		return (
			node.nodeType === 1 &&
			(node as HTMLElement).classList.contains('unread') &&
			node.getBoundingClientRect().bottom - node.getBoundingClientRect().height * 0.33 <= elmCoords.bottom
		);
	}

	private searchVisibleNotifs(): void {
		if (this.notifications.length > 0) {
			const nodes = this.notifsContainer.nativeElement.childNodes;
			if (!nodes) return; // should never happen

			const nodesToSetAsSeen = Array.from(nodes)
				.filter((node) => this.isNodeNotifNotReadVisible(node as HTMLElement))
				.reduce((acc, cur) => {
					return [...acc, (cur as HTMLElement).id];
				}, [] as string[]);
			if (nodesToSetAsSeen.length > 0) {
				this.setAsRead.emit(nodesToSetAsSeen);
			}
		}
	}

	private checkNotifications(): void {
		this.isLoading = this.notifications === undefined || this.notifications === null;
		this.changeDetector.detectChanges();
	}

	private getLastNodeBeforeScroll(childNodes: NodeListOf<ChildNode>): HTMLDivElement | null {
		return Array.from(childNodes)
			.reverse()
			.find((node) => node.nodeType === 1) as HTMLDivElement | null;
	}

	public onScroll(e: Event): void {
		const elm = e.target as HTMLDivElement;

		const nodes = elm.childNodes;
		if (!nodes) return; // should never happen
		const antePenult = this.getLastNodeBeforeScroll(nodes);

		this.searchVisibleNotifs();
		if (antePenult?.getBoundingClientRect()) {
			const computePercentScroll = (scroll: number, height: number, clientHeight: number): number => {
				return scroll / (height - clientHeight);
			};

			if (computePercentScroll(elm.scrollTop, elm.scrollHeight, elm.clientHeight) > 0.83 && this.canScroll) {
				this.scrollNotif.emit();
				this.isWaitingData = true;
				this.changeDetector.detectChanges();
			}
		}
	}
}

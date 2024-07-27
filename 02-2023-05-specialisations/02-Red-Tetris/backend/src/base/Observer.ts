interface IObserver<T> {
	update: (e: string, o: T) => void;
	name?: string;
}

export interface IEvent {
	name: string;
}

export type Suscriber = {
	event: IEvent;
	observer: IObserver<Observable>;
};

export abstract class Observable {
	protected observers: Array<Suscriber> = [];

	public notifyObserver(observerId: string, eventId: string): void {
		this.observers
			.find((p) => p.event.name === eventId && p.observer.name === observerId)
			?.observer.update(eventId, this);
	}
	public addObserver(suscriber: Suscriber): void {
		this.observers.push(suscriber);
	}

	public deleteObserver(suscriber: Suscriber): void {
		const idx = this.observers.indexOf(suscriber);
		if (idx > -1) this.observers.splice(idx, 1);
	}
}

export abstract class EventsManager<T extends { update: (data: U) => unknown }, U> {
	protected listeners: Map<string, T> = new Map();
	public notifyObserver(eventType: string, data: U): void {
		this.listeners.get(eventType)?.update(data);
	}
	public addObserver(eventType: string, listener: T): void {
		this.listeners.set(eventType, listener);
	}
}

export abstract class Observer<T> implements IObserver<T> {
	public observables: Array<T> = [];
	public abstract update(eventId: string, observable: T): void;
}

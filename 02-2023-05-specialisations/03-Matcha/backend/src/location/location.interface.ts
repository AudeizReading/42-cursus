interface ILocationType<T> {
	id: number;
	latitude: number;
	longitude: number;
	userId: number;
	createdAt: T;
	updatedAt: T;
}

export type ILocation = ILocationType<Date>;
export type IDatabaseLocation = ILocationType<number>;

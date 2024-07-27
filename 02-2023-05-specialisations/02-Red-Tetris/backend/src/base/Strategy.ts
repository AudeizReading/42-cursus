export interface CreationStrategy<T, U> {
	create(name: string, data?: U): Promise<T>;
}

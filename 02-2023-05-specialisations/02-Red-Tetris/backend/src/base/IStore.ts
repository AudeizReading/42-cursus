export default interface IStore<T> {
	get(id: string): T | undefined;
	save(id: string, value: T): void;
	delete(id: string): void;
	has(id: string): boolean;
	get all(): T[];
	get total(): number;
}

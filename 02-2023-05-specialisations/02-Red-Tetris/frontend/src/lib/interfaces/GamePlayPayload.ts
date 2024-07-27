export interface GamePlayPayload<T> {
	gameId: string;
	payload: T;
}

export interface GamePlayPayloads<T> {
	gameId: string;
	payload: T[];
}

import { IGameJSON } from '../../../eventsIO/payloads/types/IPayload';

export function createGame(overrides: Partial<IGameJSON> = {}): IGameJSON {
	return {
		id: expect.any(String) as unknown as string,
		gamers: [],
		state: 'CreatedState',
		winner: null,
		...overrides,
	};
}

export function createGames(overrides: Partial<IGameJSON>[] = []): IGameJSON[] {
	if (overrides.length === 0) {
		return [];
	}
	return overrides.map((game) => createGame(game));
}

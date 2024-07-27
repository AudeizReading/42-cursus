import { createGames } from '../../game/utils/creation';
import { IPlayerJSON, IRoomJSON } from '../../../eventsIO/payloads/types/IPayload';

function createRoom(overrides: Partial<IRoomJSON> = {}): IRoomJSON {
	return {
		name: undefined as unknown as string,
		dateCreated: expect.any(String) as unknown as Date,
		leader: undefined as unknown as IPlayerJSON,
		winner: null,
		gameState: false,
		players: [],
		totalPlayers: 0,
		readys: [],
		totalReady: 0,
		games: createGames(),
		...overrides,
	};
}

export { createRoom };

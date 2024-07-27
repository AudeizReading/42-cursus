import { IPlayerJSON } from '../../../eventsIO/payloads/types/IPayload';

function createPlayer(overrides: Partial<IPlayerJSON> = {}): IPlayerJSON {
	return {
		username: undefined as unknown as string,
		sessionID: undefined as unknown as string,
		dateCreated: expect.any(String) as unknown as Date,
		leads: [],
		wins: [],
		connected: true,
		roomsState: [],
		...overrides,
	};
}

export { createPlayer };

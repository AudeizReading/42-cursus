import { IRoomState } from '../../../../rooms/roomState/IRoomState';
function createRoomState(overrides: Partial<IRoomState> = {}): IRoomState {
	return {
		name: undefined as unknown as string,
		status: 'active',
		leads: true,
		wins: false,
		readys: 0,
		started: false,
		...overrides,
	};
}

export { createRoomState };

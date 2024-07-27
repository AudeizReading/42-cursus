import { createRoom } from '../room/utils/creation';
import { IPlayerJSON, IRoomJSON, IRoomState, Socket, createPlayer } from '../client/events';
import { createRoomState } from '../client/events';
import { colors } from '../../infra';

const config = (val: string): { [key: string]: string } => {
	return {
		client: `${colors.fCyan}${colors.bold}${val}${colors.reset}`,
		room: `${colors.fMagenta}${colors.bold}${val}${colors.reset}`,
		eventI: `${colors.fYellow}${colors.bold}${val}${colors.reset}`,
		eventO: `${colors.fBlue}${colors.bold}${val}${colors.reset}`,
	};
};

type ClientConfigTest = {
	client: Socket | undefined;
	username: string;
	roomName: string;
	roomName2: string;
	playerExpect: IPlayerJSON;
	roomExpect: IRoomJSON;
	roomsState: IRoomState[];
};

let client: Socket;
const clientConfig = (username: string): ClientConfigTest => {
	const roomName = 'Loulouville';
	const roomName2 = 'Loulouville2';
	return {
		client,
		username,
		roomName,
		roomName2,
		playerExpect: createPlayer({ username, sessionID: expect.any(String) as unknown as string }),
		roomExpect: createRoom(),
		roomsState: [createRoomState({ name: roomName })],
	};
};

export { config, clientConfig };

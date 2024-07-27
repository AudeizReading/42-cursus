import { RoomState } from '../rooms/roomState/RoomState';
import Player from './Player';

describe('Player Class', () => {
	test('should create a Player instance with valid username and sessionID', () => {
		const validUsername = 'validUsername';
		const validSessionID = 'validSessionID';
		const player = new Player(validUsername, validSessionID);

		expect(player).toBeDefined();
		expect(player.username).toBe(validUsername);
		expect(player.sessionID).toBe(validSessionID);
		expect(player.dateCreated).toBeInstanceOf(Date);
		expect(player.connected).toBe(true);
	});

	test('should add leads and wins correctly', () => {
		const player = new Player('validUsername', 'validSessionID');

		player.leads.push('game1');
		player.wins.push('game2');

		expect(player.leads).toEqual(['game1']);
		expect(player.wins).toEqual(['game2']);
	});

	test('should add room state correctly', () => {
		const player = new Player('validUsername', 'validSessionID');
		const roomStateMock = {
			name: 'room1',
			status: 'ready',
			leads: true,
			readys: 1,
			wins: false,
		};

		player.addRoomState(roomStateMock as RoomState);

		expect(player.roomsState).toEqual(expect.arrayContaining([roomStateMock]));
	});

	test('should change room status correctly', () => {
		const player = new Player('validUsername', 'validSessionID');
		const roomStateMock = new RoomState({
			name: 'room1',
			status: 'active',
			leads: true,
			readys: 1,
			wins: false,
		});

		player.addRoomState(roomStateMock);
		player.changeRoomStatus('ready', roomStateMock.name);
		expect(player.roomsState).toEqual(
			expect.arrayContaining([
				{
					leads: true,
					name: 'room1',
					readys: 1,
					started: false,
					status: 'ready',
					wins: false,
				},
			]),
		);
	});

	test('should disconnect player correctly', () => {
		const player = new Player('validUsername', 'validSessionID');
		player.disconnect();

		expect(player.connected).toBe(false);
	});
});

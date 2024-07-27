import { Socket } from 'socket.io-client';

import { IRoomState } from '../rooms/roomState/IRoomState';

import { expect } from '@jest/globals';
import { handleAppLifeCycle } from './app/handlers';
import { clientConfig, config } from './utils/configs';
import { destroyTimer, disconnectTimer } from './utils/env';
import {
	changeUsername,
	createClient,
	createIncomingAction,
	createOutgoingAction,
	createRoomState,
	createdRoomToBeChanged,
	createdRoomToBeClosedNobodyIn,
	createdRoomToBeOpened,
	disconnectOneClient,
	getRoomInfo,
	getRoomsAfterLeavingFirstJoined,
	getRoomsPlayerWithTwoRoomsCreated,
	getRoomsWithTwoRoomsCreated,
	joinRoomWithLeadingTwoRoomsUnjoined,
	joinTheSecondRoomWithLeadingTwoRooms,
	leaveFirstRoomJoined,
	leaveSecondRoomJoined,
	sendMessageToOneRoom,
	sendMessageToSelf,
	sessionId,
	setAsReadyIntoOneRoomThenCheckRoomInfo,
	testOutgoingEventWithIncomingAct,
} from './client/events';

describe('* All Server IO Events', () => {
	let client: Socket;
	let { username } = clientConfig('allEventsCreateClient');
	const { roomName, roomName2 } = clientConfig('allEventsCreateClient');
	const { playerExpect, roomExpect, roomsState } = clientConfig('allEventsCreateClient');

	handleAppLifeCycle();

	describe('Create Socket Client', () => {
		test(`client ${config(username).client} should be created`, () => {
			client = createClient({ username });
			expect(client).toBeInstanceOf(Socket);
			expect(client).toBeDefined();
			expect(client).not.toBeNull();
		});
	});

	describe('Connect to Server IO', () => {
		test(`${config(username).client} join Server\
, ${config('no one').eventI} -> ${config('join').eventO} events`, async () => {
			await testOutgoingEventWithIncomingAct({
				client,
				toSend: createIncomingAction('undefined', undefined),
				expected: createOutgoingAction('join', {
					...playerExpect,
					sessionID: sessionId,
				}),
			});
		}, 2000);
	});

	describe(`Create rooms`, () => {
		test(`${config(username).client} create room : ${config(roomName).room}\
, ${config('createRoom').eventI} -> ${config('roomOpened').eventO} events`, async () => {
			await createdRoomToBeOpened({ client, roomName, playerExpect, roomExpect });
		});

		test(`${config(username).client} create room : ${config(roomName2).room}\
, ${config('createRoom').eventI} -> ${config('roomChange').eventO} events`, async () => {
			await createdRoomToBeChanged({
				client,
				roomName,
				roomName2,
				playerExpect,
				roomExpect,
			});
		});
	});

	describe(`Join room & change username`, () => {
		describe('Join room', () => {
			test(`${config(username).client} join room : ${config(roomName).room}\
, ${config('joinRoom').eventI} -> ${config('roomChange').eventO} events`, async () => {
				await joinRoomWithLeadingTwoRoomsUnjoined({
					client,
					roomName,
					roomName2,
					playerExpect,
					roomExpect,
					roomsState,
				});
			});
		});

		describe('Change username', () => {
			const _username = 'allEventsChangeUsername';
			test(`${config(username).client} change username : ${config(_username).room}\
, ${config('changeUsername').eventI} -> ${config('playerChange').eventO} events`, async () => {
				await changeUsername({
					client,
					roomName,
					roomName2,
					playerExpect,
					username: _username,
					roomsState,
				});
				username = _username;
			});
		});
	});

	describe("Get whole rooms & get player's rooms & get room", () => {
		describe('Get rooms', () => {
			test(`${config(username).client} get rooms\
, ${config('getRooms').eventI} -> ${config('getRooms').eventO} events`, async () => {
				await getRoomsWithTwoRoomsCreated({
					client,
					username,
					roomName,
					roomName2,
					playerExpect,
					roomExpect,
					roomsState,
				});
			});
		});

		describe("Get player's rooms", () => {
			test(`${config(username).client} get player's rooms\
, ${config('getRoomsPlayer').eventI} -> ${config('getRoomsPlayer').eventO} events`, async () => {
				await getRoomsPlayerWithTwoRoomsCreated({
					client,
					username,
					roomName,
					roomName2,
					playerExpect,
					roomExpect,
					roomsState,
				});
			});
		});

		describe('get room', () => {
			test(`${config(username).client} get room ${config(roomName).room}\
, ${config('getRoom').eventI} -> ${config('roomInfo').eventO} events`, async () => {
				await getRoomInfo({
					client,
					username,
					roomName,
					roomName2,
					playerExpect,
					roomExpect,
					roomsState,
				});
			});
		});
	});

	describe('Message', () => {
		test(`${config(username).client} send message to room ${config(roomName).room}\
, ${config('message').eventI} -> ${config('message').eventO} events`, async () => {
			await sendMessageToOneRoom({
				client,
				username,
				roomName,
				roomName2,
				playerExpect,
				roomExpect,
				roomsState,
			});
		});

		test(`${config(username).client} send message to self ${config(username).room}\
, ${config('message').eventI} -> ${config('message').eventO} events`, async () => {
			await sendMessageToSelf({
				client,
				username,
				roomName,
				roomName2,
				playerExpect,
				roomsState,
			});
		});
	});

	describe('Set ready', () => {
		const roomsState = [
			createRoomState({
				name: roomName,
				status: 'ready',
				readys: 1,
			}),
		];
		test(`${config(username).client} set as ready into room : ${config(roomName).room}\
, ${config('ready').eventI} -> ${config('playerChange').eventO} events`, async () => {
			await setAsReadyIntoOneRoomThenCheckRoomInfo({
				client,
				username,
				roomName,
				roomName2,
				playerExpect,
				roomExpect,
				roomsState,
			});
		});
	});

	describe('Game start room1 & join room 2', () => {
		const roomsState: IRoomState[] = [
			createRoomState({
				name: roomName,
				status: 'ready',
				readys: 1,
			}),
		];
		describe('Join room 2', () => {
			test(`${config(username).client} join room : ${config(roomName2).room}\
, ${config('joinRoom').eventI} -> ${config('roomChange').eventO} events`, async () => {
				await joinTheSecondRoomWithLeadingTwoRooms({
					client,
					username,
					roomName,
					roomName2,
					playerExpect,
					roomExpect,
					roomsState,
				});
			});
		});

		describe('GameStart room 1', () => {
			test(`${config(username).client} want to start game in room : ${config(roomName).room}\
, ${config('gameStart').eventI} -> ${config('gameStart').eventO} events`, async () => {
				await testOutgoingEventWithIncomingAct({
					client,
					toSend: createIncomingAction('gameStart', roomName),
					expected: createOutgoingAction('gameStart', {
						reason: 'time',
						roomName: roomName,
						message: `The game will start in 4 seconds.`,
					}),
				});
			}, 1000);
		});
	});

	describe('Leave room 1 + getRooms + join room 2 + leave room 2', () => {
		const roomsState: IRoomState[] = [
			createRoomState({
				name: roomName,
				status: 'left',
			}),
		];

		describe('Leave room 1 during countdown for playing has been triggered, just before game starting', () => {
			test(`${config(username).client} leave room : ${config(roomName).room}\
, ${config('leaveRoom').eventI} -> ${config('roomClosed').eventO} events`, async () => {
				await leaveFirstRoomJoined({
					client,
					username,
					roomName,
					roomName2,
					playerExpect,
					roomExpect,
					roomsState,
				});
			});
		});

		describe('Get rooms', () => {
			test(`${config(username).client} get rooms\
, ${config('getRooms').eventI} -> ${config('getRooms').eventO} events`, async () => {
				await getRoomsAfterLeavingFirstJoined({
					client,
					username,
					roomName,
					roomName2,
					playerExpect,
					roomExpect,
					roomsState,
				});
			});
		});

		describe('Leave Room 2', () => {
			test(`${config(username).client} leave room : ${config(roomName2).room}\
, ${config('leaveRoom').eventI} -> ${config('roomChange').eventO} events`, async () => {
				await leaveSecondRoomJoined({
					client,
					username,
					roomName,
					roomName2,
					playerExpect,
					roomExpect,
					roomsState,
				});
			});
		});
	});

	describe('Room Closed after nobody enters in', () => {
		const roomsState: IRoomState[] = [
			createRoomState({
				name: roomName,
				status: 'left',
			}),
			createRoomState({
				name: roomName2,
				status: 'left',
			}),
		];

		test(
			`${config(username).client} create room and never enter in : \
${config(roomName + 'Closed').room}\
, ${config('createRoom').eventI} -> ${config('roomClosed').eventO} events`,
			async () => {
				await createdRoomToBeClosedNobodyIn({
					client,
					roomName,
					roomName2,
					playerExpect,
					roomExpect,
					roomsState,
				});
			},
			disconnectTimer + 1000,
		);
	});

	describe('disconnect', () => {
		test(
			'disconnect',
			(done) => {
				disconnectOneClient(client, done);
			},
			destroyTimer + 1000,
		);
	});
});

import { Socket } from 'socket.io-client';

import { IRoomState } from '../rooms/roomState/IRoomState';

import { expect } from '@jest/globals';
import { handleAppLifeCycle } from './app/handlers';
import { clientConfig, config } from './utils/configs';
import { destroyTimer } from './utils/env';
import {
	createClient,
	createIncomingAction,
	createOutgoingAction,
	createPlayer,
	createRoomState,
} from './client/events';
import { testSeveralOutgoingEvents } from './client/outgoingPayload/testers';
import { disconnectAllClients } from './client/utils/creation';
import { testSeveralOutgoingEventsSeveralTimes } from './client/outgoingPayload/testers/testSeveralOutgoingEvents';

describe('* RoomLeader Start Game', () => {
	let client1: Socket;
	let client2: Socket;

	const username1 = 'First';
	const username2 = 'Second';

	const room1 = 'Choupinou';
	const { playerExpect, roomExpect } = clientConfig(username1);
	const playerExpect1 = { ...playerExpect, username: username1 };
	const playerExpect2 = { ...playerExpect, username: username2 };

	const roomsState: IRoomState[] = [
		createRoomState({
			name: room1,
			status: 'active',
			readys: 0,
		}),
	];

	roomExpect.name = room1;

	roomExpect.leader = playerExpect1;
	roomExpect.players = [playerExpect1, playerExpect2];
	roomExpect.totalPlayers = 2;

	handleAppLifeCycle();

	test(`clients ${config(username1).client} and ${config(username2).client} should be created`, () => {
		client1 = createClient({ username: username1 });
		client2 = createClient({ username: username2 });
	});

	test(`clients ${config(username1).client} and ${config(username2).client} join Server\
, ${config('no one').eventI} -> ${config('join').eventO} (x 2) events`, async () => {
		await testSeveralOutgoingEvents(client1, createIncomingAction('undefined', undefined), [
			createOutgoingAction('join', {
				...playerExpect1,
				sessionID: expect.any(String) as unknown as string,
			}),
		]);
		await testSeveralOutgoingEvents(client2, createIncomingAction('undefined', undefined), [
			createOutgoingAction('join', {
				...playerExpect2,
				sessionID: expect.any(String) as unknown as string,
			}),
		]);
	}, 1000);

	test(`clients ${config(username1).client} and ${config(username2).client} join room ${room1},
${config(username1).client} as room's leader starts game \
, ${config('createRoom').eventI} -> [${config('roomOpened').eventO}, ${config('roomChange').eventO}: ${
		config('new leader').eventO
	}] events`, async () => {
		const player1 = {
			...playerExpect1,
			leads: [room1],
			sessionID: expect.any(String) as unknown as string,
		};

		// cree une room -> player1 leader
		await testSeveralOutgoingEvents(client1, createIncomingAction('createRoom', room1), [
			createOutgoingAction('roomOpened', {
				room: {
					...roomExpect,
					name: room1,
					leader: player1,
					players: [],
					totalPlayers: 0,
				},
				player: player1,
			}),
			createOutgoingAction('roomChange', {
				reason: 'new leader',
				room: {
					...roomExpect,
					name: room1,
					leader: player1,
					players: [],
					totalPlayers: 0,
				},
				player: player1,
			}),
		]);

		player1.roomsState = roomsState;

		// player1 entre dans la room
		await testSeveralOutgoingEvents(client1, createIncomingAction('joinRoom', room1), [
			createOutgoingAction('roomChange', {
				reason: 'player incoming',
				room: {
					...roomExpect,
					name: room1,
					players: [player1],
					totalPlayers: 1,
					leader: player1,
				},
				player: player1,
			}),
		]);

		const player2 = createPlayer({
			username: username2,
			sessionID: expect.any(String) as unknown as string,
			roomsState,
		});

		// player2 entre dans la room
		await testSeveralOutgoingEvents(client2, createIncomingAction('joinRoom', room1), [
			createOutgoingAction('roomChange', {
				reason: 'player incoming',
				room: {
					...roomExpect,
					leader: player1,
				},
				player: player2,
			}),
		]);

		// player1 est leader et demande a demarrer le jeu, le countdown commence
		await testSeveralOutgoingEventsSeveralTimes(
			client1,
			createIncomingAction('gameStart', room1),
			[
				{
					event: 'gameStart',
					times: 2,
					payloads: [
						{
							roomName: room1,
							reason: 'time',
							message: 'The game will start in 4 seconds.',
						},
						{
							roomName: room1,
							reason: 'time',
							message: 'The game will start in 3 seconds.',
						},
					],
				},
			],
			{
				name: room1,
				toWatch: [client1.id ?? ''],
			},
		);

		// Le client2 essaye de demarrer le jeu -> rien ne doit se produire
		client2.emit('gameStart', room1);

		// Le client1 reset le countdown
		client1.emit('gameStart', room1);
		// Le client1 restart le countdown
		client1.emit('gameStart', room1);

		// Les players se set as ready to play, mais comme le countdown est deja en cours, rien ne doit se produire
		client2.emit('ready', room1);
		client1.emit('ready', room1);

		// Le client1 reset le countdown
		client1.emit('gameStart', room1);

		// Le client1 restart le countdown
		await testSeveralOutgoingEventsSeveralTimes(
			client1,
			createIncomingAction('gameStart', room1),
			[
				{
					event: 'gameStart',
					times: 6,
					payloads: [
						{
							// payload relatif au 2e gameStart qui restart le countdown
							roomName: room1,
							reason: 'time',
							message: 'The game will start in 4 seconds.',
						},
						{
							// payload relatif a createIncomingAction (jusqu'au dernier payload du tableau)
							roomName: room1,
							reason: 'time',
							message: 'The game will start in 4 seconds.',
						},
						{
							roomName: room1,
							reason: 'time',
							message: 'The game will start in 3 seconds.',
						},
						{
							reason: 'time',
							message: 'The game will start in 2 seconds.',
							roomName: room1,
						},
						{
							reason: 'time',
							message: 'The game will start in 1 second.',
							roomName: room1,
						},
						{
							reason: 'start',
							roomName: room1,
						},
					],
				},
			],
			{
				name: room1,
				toWatch: [client1.id ?? ''],
			},
		);
	}, 8000);

	describe('disconnect all clients', () => {
		test(
			'disconnect',
			(done) => {
				try {
					console.log('disconnect all clients');
					disconnectAllClients(done);
				} catch (e) {
					console.error(e);
					done(e);
				}
			},
			destroyTimer + 1000,
		);
	});
});

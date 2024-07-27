import { Socket } from 'socket.io-client';

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
describe('* Disconnect Players State', () => {
	let client1: Socket;
	let client2: Socket;
	let client3: Socket;
	let client4: Socket;
	let client5: Socket;

	const username1 = 'First';
	const username2 = 'Second';
	const username3 = 'Third';
	const username4 = 'Fourth';
	const username5 = 'Fifth';

	const room1 = 'Choupinou';
	const { playerExpect, roomExpect } = clientConfig('First');
	const playerExpect1 = { ...playerExpect, username: username1 };
	const playerExpect2 = { ...playerExpect, username: username2 };
	const playerExpect3 = { ...playerExpect, username: username3 };
	const playerExpect4 = { ...playerExpect, username: username4 };
	const playerExpect5 = { ...playerExpect, username: username4 };

	roomExpect.name = room1;
	roomExpect.leader = playerExpect1;

	// different states
	const leaderState = createRoomState({
		name: room1,
	});

	const playerState = createRoomState({
		name: room1,
		leads: false,
	});

	const leads = [room1];

	// different players
	const player1CreateRoom = {
		...playerExpect1,
		leads,
	};

	// player join form
	const player1Join = {
		...playerExpect1,
		leads,
		roomsState: [leaderState],
	};

	const player2Join = createPlayer({
		username: username2,
		roomsState: [playerState],
	});

	const player3Join = createPlayer({
		username: username3,
		roomsState: [playerState],
	});

	const player4Join = createPlayer({
		username: username4,
		roomsState: [playerState],
	});

	handleAppLifeCycle();

	describe('Create Sockets Clients', () => {
		test(`client ${config(username1).client} should be created`, () => {
			client1 = createClient({ username: username1 });
			expect(client1).toBeInstanceOf(Socket);
			expect(client1).toBeDefined();
			expect(client1).not.toBeNull();
		});

		test(`client ${config(username2).client} should be created`, () => {
			client2 = createClient({ username: username2 });
			expect(client2).toBeInstanceOf(Socket);
			expect(client2).toBeDefined();
			expect(client2).not.toBeNull();
		});

		test(`client ${config(username3).client} should be created`, () => {
			client3 = createClient({ username: username3 });
			expect(client3).toBeInstanceOf(Socket);
			expect(client3).toBeDefined();
			expect(client3).not.toBeNull();
		});

		test(`client ${config(username4).client} should be created`, () => {
			client4 = createClient({ username: username4 });
			expect(client4).toBeInstanceOf(Socket);
			expect(client4).toBeDefined();
			expect(client4).not.toBeNull();
		});

		test(`client ${config(username5).client} should be created`, () => {
			client5 = createClient({ username: username5 });
			expect(client5).toBeInstanceOf(Socket);
			expect(client5).toBeDefined();
			expect(client5).not.toBeNull();
		});
	});

	describe('Connect to Server IO', () => {
		test(`${config(username1).client} join Server\
	, ${config('no one').eventI} -> ${config('join').eventO} events`, async () => {
			await testSeveralOutgoingEvents(client1, createIncomingAction('undefined', undefined), [
				createOutgoingAction('join', {
					...playerExpect1,
				}),
			]);
		}, 500);

		test(`${config(username2).client} join Server\
	, ${config('no one').eventI} -> ${config('join').eventO} events`, async () => {
			await testSeveralOutgoingEvents(client2, createIncomingAction('undefined', undefined), [
				createOutgoingAction('join', {
					...playerExpect2,
				}),
			]);
		}, 500);
	});

	describe('Clients enter room 1', () => {
		test(`${config(username1).client} should create room ${room1} and be leader\
	, ${config('createRoom').eventI} -> [${config('roomOpened').eventO}, ${config('roomChange').eventO}: ${
		config('new leader').eventO
	}] events`, async () => {
			await testSeveralOutgoingEvents(client1, createIncomingAction('createRoom', room1), [
				createOutgoingAction('roomOpened', {
					room: {
						...roomExpect,
						leader: player1CreateRoom,
					},
					player: player1CreateRoom,
				}),
				createOutgoingAction('roomChange', {
					reason: 'new leader',
					room: {
						...roomExpect,
						leader: player1CreateRoom,
					},
					player: player1CreateRoom,
				}),
			]);
		});

		test(`${config(username1).client} should join room ${room1} and be alone inside\
		, ${config('joinRoom').eventI} -> [${config('roomChange').eventO}: ${
			config('player incoming').eventO
		}] events`, async () => {
			await testSeveralOutgoingEvents(client1, createIncomingAction('joinRoom', room1), [
				createOutgoingAction('roomChange', {
					reason: 'player incoming',
					room: {
						...roomExpect,
						players: [player1Join],
						totalPlayers: 1,
						leader: player1Join,
					},
					player: player1Join,
				}),
			]);
		});

		test(`${config(username2).client} should join room ${room1} and be with ${config(username1).client} in\
		, ${config('joinRoom').eventI} -> [${config('roomChange').eventO}: ${
			config('player incoming').eventO
		}] events`, async () => {
			await testSeveralOutgoingEvents(client2, createIncomingAction('joinRoom', room1), [
				createOutgoingAction('roomChange', {
					reason: 'player incoming',
					room: {
						...roomExpect,
						players: [player1Join, player2Join],
						totalPlayers: 2,
						leader: player1Join,
					},
					player: player2Join,
				}),
			]);
		});

		test(`${config(username1).client} should listen ${config(username2).client} joining room ${room1}\
		, ${config('no one').eventI} -> [${config('roomChange').eventO}: ${
			config('player incoming').eventO
		}] events`, async () => {
			await testSeveralOutgoingEvents(
				client1,
				createIncomingAction('undefined', undefined),
				[
					createOutgoingAction('roomChange', {
						reason: 'player incoming',
						room: {
							...roomExpect,
							players: [player1Join, player2Join],
							totalPlayers: 2,
							leader: player1Join,
						},
						player: player2Join,
					}),
				],
				{
					name: room1,
					toWatch: [client2.id ?? ''],
				},
			);
		});
	});

	describe('Connect to Server IO', () => {
		// si je le passe audessus,
		// a la suite logique des autres connexions au serveur de client1 et client2
		// -> le test ne passe plus du tout: comportement bizarre
		// car ils sont regroupes sous les meme describe en analyse de tests
		test(`${config(username3).client} join Server\
		, ${config('no one').eventI} -> ${config('join').eventO} events`, async () => {
			await testSeveralOutgoingEvents(client3, createIncomingAction('undefined', undefined), [
				createOutgoingAction('join', {
					...playerExpect3,
				}),
			]);
		}, 500);

		test(`${config(username4).client} join Server\
		, ${config('no one').eventI} -> ${config('join').eventO} events`, async () => {
			await testSeveralOutgoingEvents(client4, createIncomingAction('undefined', undefined), [
				createOutgoingAction('join', {
					...playerExpect4,
				}),
			]);
		}, 500);
	});

	describe('Clients enter room 1', () => {
		test(`${config(username3).client} should join room ${room1} and be alone inside\
		, ${config('joinRoom').eventI} -> [${config('roomChange').eventO}: ${
			config('player incoming').eventO
		}] events`, async () => {
			await testSeveralOutgoingEvents(client3, createIncomingAction('joinRoom', room1), [
				createOutgoingAction('roomChange', {
					reason: 'player incoming',
					room: {
						...roomExpect,
						players: [player1Join, player2Join, player3Join],
						totalPlayers: 3,
						leader: player1Join,
					},
					player: player3Join,
				}),
			]);
		});
	});

	describe('Clients enter room 1', () => {
		test(`${config(username4).client} should join room ${room1} and be with others in\
, ${config('joinRoom').eventI} -> [${config('roomChange').eventO}: ${
			config('player incoming').eventO
		}] events`, (done) => {
			setTimeout(async () => {
				await testSeveralOutgoingEvents(client4, createIncomingAction('joinRoom', room1), [
					createOutgoingAction('roomChange', {
						reason: 'player incoming',
						room: {
							...roomExpect,
							players: [player1Join, player2Join, player3Join, player4Join],
							totalPlayers: 4,
							leader: player1Join,
						},
						player: player4Join,
					}),
				]);
				done();
			}, 100);
		}, 400);
	});

	describe(`Clients should play and end a Game`, () => {
		test(`${config(username1).client} should stay leader after ended game, \
${config('ready').eventI} -> [${config('playerChange').eventO}], \
${config('gameChange').eventI} -> [${config('roomChange: new winner').eventO}] events`, (done) => {
			let idInterval: NodeJS.Timeout | null = null;
			client1.on('roomChange', (payload): void => {
				if (payload.reason === 'new winner') {
					expect(payload.room.leader.username).toBe(username1);
					expect(payload.room.winner).toBeDefined();
					expect(payload.room.winner).toHaveProperty('wins');
					expect(payload.room.winner.wins.length).toBeGreaterThanOrEqual(1);
					expect(payload.room.totalPlayers).toBeGreaterThanOrEqual(4);
					expect(payload.room.totalReady).toBe(0);
					if (idInterval) clearInterval(idInterval);
					done();
				}
			});
			client4.on('playerChange', (payload): void => {
				if (payload.reason === 'ready' && payload.player.username === username4) {
					idInterval = setInterval(() => {
						client1.emit('gameChange', { action: 'space', room: room1 });
						client2.emit('gameChange', { action: 'space', room: room1 });
						client3.emit('gameChange', { action: 'space', room: room1 });
						client4.emit('gameChange', { action: 'space', room: room1 });
					}, 100);
				}
			});

			client1.emit('ready', room1);
			client2.emit('ready', room1);
			client3.emit('ready', room1);
			client4.emit('ready', room1);
		}, 6000);
	});

	describe(`A Second Game should be played`, () => {
		test(`${config(username1).client} should stay leader after ended game, \
${config('ready').eventI} -> [${config('playerChange').eventO}], \
${config('gameChange').eventI} -> [${config('roomChange: new winner').eventO}] events`, (done) => {
			let idInterval: NodeJS.Timeout | null = null;
			client1.on('roomChange', (payload): void => {
				if (payload.reason === 'new winner') {
					expect(payload.room.leader.username).toBe(username1);
					expect(payload.room.winner).toBeDefined();
					expect(payload.room.winner).toHaveProperty('wins');
					expect(payload.room.winner.wins.length).toBeGreaterThanOrEqual(1);
					expect(payload.room.totalPlayers).toBeGreaterThanOrEqual(4);
					expect(payload.room.totalReady).toBe(0);
					if (idInterval) clearInterval(idInterval);
					done();
				}
			});
			client4.on('playerChange', (payload): void => {
				if (payload.reason === 'ready' && payload.player.username === username4) {
					const actions = ['space', 'left', 'right', 'down', 'up'];
					idInterval = setInterval(() => {
						client1.emit('gameChange', { action: actions[Math.floor(Math.random() * 5) % 5], room: room1 });
						client2.emit('gameChange', { action: actions[Math.floor(Math.random() * 5) % 5], room: room1 });
						client3.emit('gameChange', { action: actions[Math.floor(Math.random() * 5) % 5], room: room1 });
						client4.emit('gameChange', { action: actions[Math.floor(Math.random() * 5) % 5], room: room1 });
					}, 100);
				}
			});

			client1.emit('ready', room1);
			client2.emit('ready', room1);
			client3.emit('ready', room1);
			client4.emit('ready', room1);
		}, 6000);
	});

	describe('Connect to Server IO', () => {
		test(`${config(username5).client} join Server\
	, ${config('no one').eventI} -> ${config('join').eventO} events`, async () => {
			await testSeveralOutgoingEvents(client5, createIncomingAction('undefined', undefined), [
				createOutgoingAction('join', {
					...playerExpect5,
				}),
			]);
		});
	});

	describe('A Fifth Player enters in Room 1, after Third Game started', () => {
		test(`${config(username1).client} should stay leader after ended game, \
${config(username5).client} should be set as idle when entering room,\
${config('ready').eventI} -> [${config('playerChange').eventO}], \
${config('gameChange').eventI} -> [${config('roomChange: new winner').eventO}] events`, (done) => {
			let idInterval: NodeJS.Timeout | null = null;
			client1.on('roomChange', (payload): void => {
				if (payload.reason === 'new winner') {
					expect(payload.room.leader.username).toBe(username1);
					expect(payload.room.winner).toBeDefined();
					expect(payload.room.winner).toHaveProperty('wins');
					expect(payload.room.winner.wins.length).toBeGreaterThanOrEqual(1);
					expect(payload.room.totalPlayers).toBe(5);
					expect(payload.room.totalReady).toBe(0);
					if (idInterval) clearInterval(idInterval);
					done();
				}
				if (payload.reason === 'player incoming') {
					expect(payload.room.players).toHaveLength(5);
					expect(payload.player.username).toBe(username5);
					expect(payload.player.roomsState).toHaveLength(1);
					expect(payload.player.roomsState[0].status).toBe('idle');
				}
			});
			client4.on('playerChange', (payload): void => {
				if (payload.reason === 'ready' && payload.player.username === username4) {
					const actions = ['space', 'left', 'right', 'down', 'up'];
					idInterval = setInterval(() => {
						client1.emit('gameChange', { action: actions[Math.floor(Math.random() * 5) % 5], room: room1 });
						client2.emit('gameChange', { action: actions[Math.floor(Math.random() * 5) % 5], room: room1 });
						client3.emit('gameChange', { action: actions[Math.floor(Math.random() * 5) % 5], room: room1 });
						client4.emit('gameChange', { action: actions[Math.floor(Math.random() * 5) % 5], room: room1 });
					}, 100);
				}
			});
			client1.on('gameStart', (payload) => {
				if (payload.reason === 'start') {
					client5.emit('joinRoom', room1);
				}
			});

			client1.emit('ready', room1);
			client2.emit('ready', room1);
			client3.emit('ready', room1);
			client4.emit('ready', room1);
		}, 6000);
	});

	describe('Disconnect all clients', () => {
		test(
			'disconnect',
			(done) => {
				let nb = 0;
				client1.on('disconnect', () => {
					nb++;
					client1.off('disconnect');
					if (nb === 5) {
						setTimeout(() => {
							done();
						}, destroyTimer);
					}
				});

				client2.on('disconnect', () => {
					nb++;
					client2.off('disconnect');
					if (nb === 5) {
						setTimeout(() => {
							done();
						}, destroyTimer);
					}
				});

				client3.on('disconnect', () => {
					nb++;
					client3.off('disconnect');
					if (nb === 5) {
						setTimeout(() => {
							done();
						}, destroyTimer);
					}
				});

				client4.on('disconnect', () => {
					nb++;
					client4.off('disconnect');
					if (nb === 5) {
						setTimeout(() => {
							done();
						}, destroyTimer);
					}
				});

				client5.on('disconnect', () => {
					nb++;
					client5.off('disconnect');
					if (nb === 5) {
						setTimeout(() => {
							done();
						}, destroyTimer);
					}
				});
				client1.disconnect();
				client2.disconnect();
				client3.disconnect();
				client4.disconnect();
				client5.disconnect();
			},
			destroyTimer + 1000,
		);
	});
});

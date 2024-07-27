import { Socket } from 'socket.io-client';

import { expect, describe, test } from '@jest/globals';
import { destroyTimer, disconnectTimer } from './utils/env';
import { createClient, updateDatasClients } from './client/utils/creation';
import { config } from './utils/configs';
import { handleAppLifeCycle } from './app/handlers';
describe('* Player A disconnects during solo Game but Player B is still in waiting room', () => {
	let client1: Socket;
	let client2: Socket;
	const username1 = 'PlayerA';
	const username2 = 'PlayerB';
	const room1 = 'Aquasplash';
	handleAppLifeCycle();
	describe('Create Sockets Clients', () => {
		test(`client ${config(username1).client} should be created`, () => {
			client1 = createClient({ username: username1 });
		});
		test(`client ${config(username2).client} should be created`, () => {
			client2 = createClient({ username: username2 });
		});
	});
	describe('Connect Sockets Clients', () => {
		test(`\
client ${config(username1).client} and \
client ${config(username2).client} \
should connect to server`, (done) => {
			let nb = 0;
			client2.on('join', (data) => {
				updateDatasClients(client2, data.sessionID);
				client2.off('join');
				nb++;
				if (nb === 2) done();
			});
			client1.on('join', (data) => {
				updateDatasClients(client1, data.sessionID);
				client1.off('join');
				nb++;
				if (nb === 2) done();
			});
			client1.connect();
			client2.connect();
		});
	});

	describe('Create and Enter Room', () => {
		test(`\
client ${config(username1).client} should create room ${config(room1).room} then \
client ${config(username1).client} and \
client ${config(username2).client} \
should enter room ${config(room1).room}`, (done) => {
			let nb = 0;
			client2.on('roomOpened', () => {
				client2.off('roomOpened');
				client2.emit('joinRoom', room1);
			});
			client1.on('roomOpened', () => {
				client1.off('roomOpened');
				client1.emit('joinRoom', room1);
			});
			client2.on('roomChange', (data) => {
				if (data.reason.includes('player incoming')) {
					client2.off('roomChange');
					nb++;
				}
				if (nb === 2) done();
			});
			client1.on('roomChange', (data) => {
				if (data.reason.includes('player incoming')) {
					client1.off('roomChange');
					nb++;
					if (nb === 2) done();
				}
			});
			client1.emit('createRoom', room1);
		});
	});

	describe('Start Game', () => {
		test(`\
client ${config(username1).client} should start game in room ${config(room1).room} then \
client ${config(username1).client} disconnects totally and \
client ${config(username2).client} \
should take the lead of the room ${config(room1).room}`, (done) => {
			let nb = 0;
			const shouldBe = 7;

			client1.on('disconnect', () => {
				client1.off('disconnect');
				nb++;
				if (nb === shouldBe) done();
				client2.emit('getRoom', room1);
			});

			client2.on('roomInfo', (data) => {
				if (data === null) {
					// si room null : erreur
					expect(true).toBe(false);
				}
			});

			client2.on('roomChange', (data) => {
				if (data.reason.includes('new winner')) {
					nb++;
				}
				if (data.reason.includes('new leader')) {
					if (data.room.leader.username === username2) {
						nb++;
						/// playerB restart une partie apres avoir obtenu le lead suite au depart de playerA
						client2.emit('gameStart', room1);
					}
				}
				if (nb === shouldBe) done();
			});

			client2.on('playerChange', (data) => {
				if (data.reason.includes('disconnected player')) {
					client2.off('playerChange');
					nb++;
				}
				if (nb === shouldBe) done();
			});

			client2.on('gameStart', (data) => {
				if (data.reason.includes('start')) {
					if (client1.connected) {
						setTimeout(() => {
							nb++;
							client1.disconnect();
						}, 2500);
					} else {
						nb++;
						/// check ici pour restart une partie par playerB
						client2.off('gameStart');
					}
				}
				if (nb === shouldBe) done();
			});

			client1.on('gameStart', (data) => {
				if (data.reason.includes('start')) {
					nb++;
					client1.off('gameStart');
				}
			});
			client1.emit('gameStart', room1);
		}, 300000);
	});

	describe('Disconnect connected clients', () => {
		test(
			`disconnect client ${config(username1).client} and \
client ${config(username2).client}`,
			(done) => {
				// ici on teste que le game se kill quand la room se close car plus aucun joueur dedans
				// (c'est pour ca qu'on attend destroyTimer + disconnectTimer + 500)
				client2.on('disconnect', () => {
					client2.off('disconnect');
					setTimeout(
						() => {
							done();
						},
						destroyTimer + disconnectTimer + 500,
					);
				});
				if (client2.connected) client2.disconnect();
			},
			destroyTimer + disconnectTimer + 2000,
		);
	});
});

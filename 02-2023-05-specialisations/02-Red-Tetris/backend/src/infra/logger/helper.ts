import Player from '../../players/Player';
import Room from '../../rooms/Room';
import { Socket } from 'socket.io';
import { Session } from '..';
import { colors } from '.';
import { Formatter, StringsLoggingFormat, Styler, dashSeparator, dotSeparator } from './stringStyler';
import { IPlayerJSON } from 'tests/client/events';
import { BasicDataStylers } from './stringStyler/Styler';

export function logPlayer(player: Player): StringsLoggingFormat {
	const coCol = player.connected ? colors.fGreen : colors.fRed;
	let pLog = `[${player.username} - ${coCol}${player.sessionID} ${colors.reset}]
\t+ ${colors.underline}created:${colors.reset} \
${colors.italic}${player.dateCreated}${colors.reset}\n`;

	if (player.leads.length > 0) {
		pLog += dotSeparator;
	}
	player.leads.forEach((lead) => {
		pLog += `\t+ ${colors.underline}leads${colors.reset}: \
${colors.fMagenta}${lead}${colors.reset}
`;
	});

	if (player.wins.length > 0) {
		pLog += dotSeparator;
	}
	player.wins.forEach((winner) => {
		pLog += `\t+ ${colors.underline}wins${colors.reset}: \
${colors.fCyan}${winner}${colors.reset}
`;
	});
	if (player.rooms.length > 0) {
		pLog += dotSeparator;
	}
	player.rooms.forEach((room) => {
		pLog += `\t+ ${colors.underline}room${colors.reset}:\n`;
		for (const [key, value] of Object.entries(room)) {
			pLog += `\t\t+ ${colors.underline}${key}${colors.reset}: \
${colors.fCyan}${value}${colors.reset}
`;
		}
	});

	pLog += dashSeparator;
	return { raw: JSON.stringify(player), pretty: pLog };
}

export function logRoom(room: Room): StringsLoggingFormat {
	const leader = logPlayer(room.leader);
	const players = room.all.map((p) => logPlayer(p));
	const winner = room.winner ? logPlayer(room.winner) : { pretty: 'not yet' };

	const pretty = `${colors.italic}[room ${room.name}${colors.reset} \
- ${colors.fGreen}${room.totalReady}${colors.reset} / ${room.total}]
${dashSeparator}
	LEADER:
${leader.pretty}
${dashSeparator}
	PLAYERS:
${players.map((p) => p.pretty).join(dashSeparator)}
	WINNER:
${winner.pretty}
${dashSeparator}
`;
	return { raw: JSON.stringify(room), pretty };
}

export function logSocket(socket: Socket): StringsLoggingFormat {
	const { handshake, request, data, id, nsp, rooms } = socket;
	const connection = {
		c: socket.connected,
		d: socket.disconnected,
		r: socket.recovered,
	};
	const state = `${connection.c ? 'connected' : connection.d ? 'disconnected' : 'unexpected connexion status'}\
 (${!connection.r && 'not '}recovered).`;

	const player: IPlayerJSON = data.player;
	const { sockets, adapter } = nsp;
	const socketsIds = [...sockets.values()];
	const logData = {
		id,
		state,
		method: request.method ?? 'NO METHOD',
		handshake: {
			...handshake,
			headers: { ...handshake.headers },
			query: { ...handshake.query },
			auth: { ...handshake.auth },
		},
		namespace: {
			name: nsp.name,
			clientsOnServer: nsp.server.engine.clientsCount,
			socketsConnected: socketsIds.map((s) => s.id),
			roomsOnNamespace: adapter.rooms,
			sidsOnNamespace: adapter.sids,
		},
		rooms: [...rooms.values()],
		player: {
			username: player.username,
			connected: player.connected,
			sessionID: player.sessionID,
			leads: [...player.leads],
			wins: [...player.wins],
			roomsState: [...player.roomsState.values()],
		},
	};

	return logFormattedNStyled(logData, new BasicDataStylers().stylers);
}

export function logFormattedNStyled(
	data: unknown,
	stylers: {
		[key: string]: Styler;
	},
): StringsLoggingFormat {
	const formatter = new Formatter(stylers);
	return formatter.format(data);
}

export function logSession(session: Session): StringsLoggingFormat {
	const { sid, player, sockets, nbClients, nbClientsConnected } = session.toJSON();

	const pretty = `* Session ${colors.italic}${sid}${colors.reset} => player: ${player.username}
\tsockets: ${colors.fGreen}${nbClients}${colors.reset} / \
${colors.bold}${nbClientsConnected}${colors.reset}
	${sockets
		.map((socket) => {
			let state = `disconnected`;
			if (socket?.connected) {
				state = `connected`;
			}
			return `\t\t${socket.id} - ${state}\n`;
		})
		.join('')}
`;
	return { raw: JSON.stringify({ sid, player, nbClients, nbClientsConnected }), pretty: pretty };
}

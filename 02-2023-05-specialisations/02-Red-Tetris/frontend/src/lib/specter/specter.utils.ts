import type { TetriminosArrayType } from '$lib/game/gameUtils';
import type { GameInfo } from '$lib/interfaces/GameInfo.interface';
import type PlayerGame from '$lib/interfaces/PlayerGame.interface';

const convertToSpecter = (player: PlayerGame): TetriminosArrayType => {
	const map: TetriminosArrayType = [];
	player.map.forEach((line) => {
		map.push([...line]);
	});
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x] != '') {
				let yy = y + 1;
				while (yy < map.length) {
					map[yy][x] = '';
					yy++;
				}
			}
		}
	}
	return map;
};

const convertScore = (player: PlayerGame | GameInfo): number | string => {
	return (player.score as number) > 1000
		? `${Math.floor((player.score as number) / 1000)}K`
		: player.score;
};

const convertUsername = (player: PlayerGame | GameInfo): string => {
	return player.player.username.length > 10
		? `${player.player.username.slice(0, 9)}…`
		: player.player.username;
};

export const normalizeSocketToPlayerGame = (player: GameInfo): PlayerGame => {
	return {
		player: {
			...player.player,
			username: convertUsername(player),
		},
		map: player.map.map,
		score: convertScore(player),
		level: player.level,
		endGame: player.endGame,
	};
};

export const convertPlayerGameToSpecter = (
	player: PlayerGame,
	isWaitingRoom: boolean,
): PlayerGame => {
	return {
		...player,
		map: isWaitingRoom ? player.map : convertToSpecter(player),
	};
};

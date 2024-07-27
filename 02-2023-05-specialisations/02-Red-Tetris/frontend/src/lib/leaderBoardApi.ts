import { PUBLIC_DOMAIN_BACK, PUBLIC_PORT_BACK } from '$env/static/public';

export interface ItemLeaderBoard {
	id: number;
	username: string;
	score: number;
}

export interface LeaderBoardResult {
	page: number;
	totalPage: number;
	results: ItemLeaderBoard[];
}

export const leaderBoardApi = async (page: number, limit: number): Promise<LeaderBoardResult> => {
	const url = `http://${PUBLIC_DOMAIN_BACK}:${PUBLIC_PORT_BACK}/leaderboard`;
	const query = `${url}?page=${page}&limit=${limit}`;
	return await fetch(query, {
		method: 'GET',
	})
		.then(async (res) => {
			return await res.json();
		})
		.catch((err) => {
			throw new Error(err);
		});
};

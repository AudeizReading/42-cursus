import { Database } from 'sqlite3';
import * as fs from 'fs';
import { PlayerGame } from '../../games/GameLogic';

export interface ItemLeaderBoard {
	id: number;
	username: string;
	score: number;
}

export interface LeaderBoardResult {
	page?: number;
	totalPage?: number;
	results?: ItemLeaderBoard[];
}

export class LeaderBoardService {
	private static db = new Database('data/leaderboard.sqlite').exec(
		fs.readFileSync(`${process.cwd()}/leaderboard.sql`).toString(),
	);

	public async insertByPlayerGame(player: PlayerGame): Promise<void> {
		await this.insert(player.getPlayer().username, player.getScore());
	}

	public async insert(username: string, score: number): Promise<void> {
		const sql = `INSERT INTO leaderboard (username, score) VALUES ('${username}', ${score});`;
		const result = new Promise((resolve, rejects) => {
			LeaderBoardService.db.run(sql, function (err) {
				return err ? rejects(err) : resolve(this.lastID);
			});
		});
		await result.catch((err) => {
			throw new Error(err.message);
		});
	}

	public async search(page: number, limit: number = 5): Promise<LeaderBoardResult> {
		if (page <= 0) throw new Error('Page is not good');
		page--;
		const selectSql = 'SELECT * FROM leaderboard ORDER BY score DESC, id ASC';
		const limitSql = `LIMIT ${limit} OFFSET ${limit * page};`;
		const sql = `${selectSql} ${limitSql}`;
		const sqlCount = `SELECT COUNT(*) as total FROM leaderboard;`;
		const countResult = new Promise((resolve, reject) => {
			LeaderBoardService.db.get(sqlCount, (err, row: { total: number }) => {
				if (err) return reject(err);
				else return resolve(row);
			});
		}) as Promise<{ total: number }>;
		const resultsSql = new Promise((resolve, rejects) => {
			LeaderBoardService.db.all(sql, (err, rows: ItemLeaderBoard[]) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		}) as Promise<ItemLeaderBoard[]>;
		const totalItem = await countResult
			.then((v) => {
				return v.total;
			})
			.catch((err: Error) => {
				throw new Error(err.message);
			});
		page++;
		const totalPage = Math.ceil(totalItem / limit);
		return {
			page,
			totalPage,
			results: await resultsSql,
		};
	}
}

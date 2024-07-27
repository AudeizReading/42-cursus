import { PlayerGame } from '../../games/GameLogic';
import { LeaderBoardResult, LeaderBoardService } from './leaderBoardService';
import { Request, Response } from 'express';

export class LeaderBoardController {
	private static leaderboard = new LeaderBoardService();
	private static async search(page: number, limit: number): Promise<LeaderBoardResult> {
		return await this.leaderboard.search(page, limit);
	}
	public static async insertByPlayerGame(playerGame: PlayerGame): Promise<void> {
		await this.leaderboard.insertByPlayerGame(playerGame);
	}

	public static getLeaderBoard(req: Request, res: Response): void {
		const page = parseInt((req.query.page as string) || '1', 10);
		const limit = parseInt((req.query.limit as string) || '5', 10);
		LeaderBoardController.search(page, limit)
			.then((result) => {
				res.json(result);
			})
			.catch(() => {
				res.status(400).json({ message: 'Bad Request' });
			});
	}
}

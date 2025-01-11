import { ChatService } from '$app/chat/chat.service';
import { ADatabase } from '$app/database/ADatabase';
import { DislikeService } from '$app/like/dislike.service';
import { LikeService } from '$app/like/like.service';
import { ViewService } from '$app/view/view.service';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { ReportService } from '$app/report/report.service';
import { BlockService } from '$app/block/block.service';

enum PointFameRating {
	LIKE = 50,
	MATCH = 100,
	DISLIKE = -50,
	VIEW = 5,
	SEND_MESSAGE = 1,
	BLOCK = -100,
	REPORT = -250,
}

@Injectable()
export class FameRatingService {
	private async updateFameRating(
		pts: number,
		user: UserService,
	): Promise<void> {
		try {
			user.setFameRating(user.getFameRating() + pts);
			await user.update();
		} catch (e) {
			Logger.error(e);
		}
	}

	private async like(likeService: LikeService): Promise<void> {
		const likedId = likeService.getLikeId();
		const userLiked = await new UserService().getByPK(likedId);
		await this.updateFameRating(PointFameRating.LIKE, userLiked);
		if (await likeService.isMatch(userLiked)) {
			await this.updateFameRating(
				PointFameRating.MATCH,
				await likeService.getUser(),
			);
			await this.updateFameRating(PointFameRating.MATCH, userLiked);
		}
	}

	private async dislike(dislikeService: DislikeService): Promise<void> {
		const dislikeId = dislikeService.getDislikeId();
		const userDisliked = await new UserService().getByPK(dislikeId);
		await this.updateFameRating(PointFameRating.DISLIKE, userDisliked);
	}

	private async view(viewService: ViewService): Promise<void> {
		const viewId = viewService.getViewId();
		const userView = await new UserService().getByPK(viewId);
		await this.updateFameRating(PointFameRating.VIEW, userView);
	}

	private async message(chatService: ChatService): Promise<void> {
		const senderId = chatService.getSendId();
		const userSender = await new UserService().getByPK(senderId);
		await this.updateFameRating(PointFameRating.SEND_MESSAGE, userSender);
	}

	private async block(blockService: BlockService): Promise<void> {
		const blockId = blockService.getBlockId();
		const userBocked = await new UserService().getByPK(blockId);
		await this.updateFameRating(PointFameRating.BLOCK, userBocked);
	}

	private async report(reportService: ReportService): Promise<void> {
		const reportId = reportService.getReportId();
		const userReport = await new UserService().getByPK(reportId);
		await this.updateFameRating(PointFameRating.REPORT, userReport);
	}

	async eventUpdate(
		value: ADatabase<unknown, unknown, unknown>,
	): Promise<void> {
		switch (value.getTableName()) {
			case 'like':
				const likeService = value as LikeService;
				await this.like(likeService);
				break;
			case 'dislike':
				const dislikeService = value as DislikeService;
				await this.dislike(dislikeService);
				break;
			case 'view':
				const viewService = value as ViewService;
				await this.view(viewService);
				break;
			case 'message':
				const chatService = value as ChatService;
				await this.message(chatService);
				break;
			case 'block':
				const blockService = value as BlockService;
				await this.block(blockService);
				break;
			case 'report':
				const reportService = value as ReportService;
				await this.report(reportService);
				break;
		}
	}
}

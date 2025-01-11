import { ADatabaseRelationUser } from '$app/database/ADatabaseRelationUser';
import {
	ConflictException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { IDatabaseReport, IReport } from './report.interface';
import { UserService } from '$app/user/user.service';
import { ADatabase } from '$app/database/ADatabase';

@Injectable()
export class ReportService extends ADatabaseRelationUser<
	IDatabaseReport,
	ReportService,
	IReport
> {
	private reportId: number;

	constructor() {
		super(ReportService, 'report');
		this.userService = new UserService();
	}

	deserialize(db: IDatabaseReport): void {
		this.id = db.id;
		this.userId = db.userId;
		this.reportId = db.reportId;
	}

	normalize(): IReport {
		const { id, userId, reportId } = this;
		return {
			id,
			userId,
			reportId,
		};
	}

	private async profilIsReport(userId: number): Promise<boolean> {
		const sql = `SELECT * FROM report \
		WHERE userId = ${this.getUserId()} AND reportId = ${userId};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((value: Array<IReport>) => {
				return value.length > 0;
			})
			.catch((err) => {
				throw new Error(err);
			});
	}

	async setReportId(userId: number): Promise<void> {
		const userService = this.userService.newInstance();
		const user = await userService.getByPK(userId);
		if (!(await user.isComplete())) {
			throw new ForbiddenException('This profile is not complete');
		}
		if (typeof userId != 'number' || userId <= 0)
			throw new Error(`'${userId}' is not valid UserID`);
		if (userId == this.getUserId()) {
			throw new ConflictException('Report your profile is not possible');
		}
		if (await this.profilIsReport(userId)) {
			throw new ConflictException('You have already report this profile');
		}
		this.reportId = userId;
	}

	getReportId(): number {
		return this.reportId;
	}

	async setReport(user: UserService): Promise<void> {
		await this.setReportId(user.getId());
	}

	private async getReportMe(): Promise<IReport[]> {
		const sql = `SELECT * FROM report WHERE reportId = ${this.getUserId()};`;
		const result = new Promise((resolve, rejects) => {
			ADatabase.db.all(sql, (err, rows) => {
				if (err) return rejects(err);
				else return resolve(rows);
			});
		});
		return await result
			.then((res) => {
				return res as IReport[];
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}

	async getReported(): Promise<IReport[]> {
		const reports: IReport[] = await this.getReportMe();
		return reports;
	}
}

import { BadRequestException, Injectable, Inject, forwardRef } from "@nestjs/common";
import { Invite, prisma } from "@prisma/client";
import { GameService } from "src/game/game.service";
import { NotifService } from "src/notif/notif.service";
import { PrismaService } from "src/prisma.service";
import { UsersService } from "src/users/users.service";
import { GameSettingsInterface, InviteDTO } from "./invite.controller";

@Injectable()
export class InviteService
{
	constructor(
		private prisma: PrismaService,
		private usersService: UsersService,
		@Inject(forwardRef(() => NotifService))
		private notifService: NotifService,
		private gameService: GameService,
		) {}

	private readonly CLAMPS = { // min/max values for each setting
		pointsToWin: {min: 3, max: 50},
		pointsGap: {min: 0, max: 10}, // Min is 0 and not 1 because front sends 0 if pointsGap is disabled
		ballSpeed: {min: 5, max: 100},
		racketSize: {min: 6, max: 100},
	};

	private async areUsersAvail(inviteData: InviteDTO)
	{
		const users = await this.prisma.user.findMany({
			where: {
				OR: [
					{id: inviteData.fromID},
					{id: inviteData.toID},
				],
			},
			include: {
				mMaking: true,
			}
		});
		if (users.length === 0)
			return false;

		const notInMM = users.every(user => !user.mMaking || user.mMaking.userId !== user.id);
		const firstOnline = await this.usersService.getUserStatus(users[0]) === "online";
		const secondOnline = await this.usersService.getUserStatus(users[1]) === "online";

		return (notInMM && firstOnline && secondOnline);
	}

	private isGoodInviteSettings(settings: GameSettingsInterface)
	{
		return (
			settings.pointsToWin >= this.CLAMPS.pointsToWin.min
			&& settings.pointsToWin <= this.CLAMPS.pointsToWin.max
			
			&& settings.ballSpeed >= this.CLAMPS.ballSpeed.min
			&& settings.ballSpeed <= this.CLAMPS.ballSpeed.max
			
			&& (settings.pointsGap === undefined
				|| (settings.pointsGap >= this.CLAMPS.pointsGap.min
					&& settings.pointsGap <= this.CLAMPS.pointsGap.max))
			
			&& settings.racketSize >= this.CLAMPS.racketSize.min
			&& settings.racketSize <= this.CLAMPS.racketSize.max
			);
	}

	async sendInvite(inviteData: InviteDTO)
	{
		const usersAvail = await this.areUsersAvail(inviteData);
		if (!usersAvail) {
			throw new BadRequestException("Some invited users are busy");
		}
		if (!this.isGoodInviteSettings(inviteData.settings)) {
			throw new BadRequestException("Invites's settings are invalid");
		}

		try {
			const newInvite = await this.prisma.invite.create({
				data: {
					fromID: inviteData.fromID,
					toID: inviteData.toID,
					settings: JSON.stringify(inviteData.settings),
				},
				include: {
					from: true
				}
			});
			// Put serialized JSON in the notif text. Frontend decodes it.
			const notifMetadata = {
				text: `${newInvite.from.name} vous invite à jouer à Pong !`,
				invite: { ...inviteData },
			};
			await this.notifService.createNotif(inviteData.toID, {
				text: JSON.stringify(notifMetadata),
				url: `/${newInvite.fromID}`,
				type: "GAMEINVITE",
			});
			delete newInvite.from; // Remove that 'from' field we included.
			return newInvite as Invite;
		}
		catch (err) {
			throw new BadRequestException();
		}
	}

	async deleteInvite(invite: InviteDTO)
	{
		try {
			const deletedInvite = await this.prisma.invite.delete({
				where: {
					fromID_toID_settings: {
						fromID: invite.fromID,
						toID: invite.toID,
						settings: JSON.stringify(invite.settings),
					}
				}
			});
			return deletedInvite;
		}
		catch (err) {
			throw new BadRequestException();
		}
	}

	async acceptInvite(inviteData: InviteDTO)
	{
		try {
			const canAccept = await this.areUsersAvail(inviteData);
			if (!canAccept)
				throw new BadRequestException("Cannot accept invite");
			await this.gameService.createGame(inviteData.fromID, inviteData.toID, inviteData);
			await this.prisma.invite.deleteMany({
				where: {
					OR: [
						{fromID: inviteData.fromID, toID: inviteData.toID},
						{fromID: inviteData.toID, toID: inviteData.fromID},
					]
				}
			});
		}
		catch (err) {
			throw new BadRequestException("Cannot accept invite");
		}
	}

	async deleteAllExpired()
	{
		const res = await this.prisma.invite.deleteMany({
			where: {
				createdAt: {
					lt: new Date(Date.now() - 1000 * 60 * 2)
				}
			}
		});
		return res.count;
	}
}

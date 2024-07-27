import Player from '../players/Player';
import Room from './Room';
import { Observable, Observer } from '../base/Observer';
import { PayloadFactory } from '../eventsIO/payloads/PayloadFactory';
import { TimeoutManager } from '../infra/io';

export class Timer extends Observer<Observable> {
	public room: Room | null = null;
	public destroySession: number = parseInt(process.env.DESTROY_TIMER ?? '15', 10) * 1000;
	public disconnectSession: number = parseInt(process.env.DISCO_TIMER ?? '15', 10) * 1000;
	public timerId: NodeJS.Timeout | null = null;
	public countdown: number = parseInt(process.env.START_GAME_TIMER ?? '10', 10);
	public lock: boolean = false;

	public update(eventId: string, observable: Observable): void {
		switch (eventId) {
			case 'PlayerReady': {
				if (this.room) {
					const player = observable as unknown as Player;

					this.room.updatePlayer(player, player.status(this.room.name));

					if (!this.lock) {
						if (this.room.canStartGame()) {
							this.startCountdown(player, this.room);
						} else {
							this.resetCountdown();
						}
					}
					break;
				}
				break;
			}
		}
	}

	public startCountdown(player: Player, room: Room): void {
		const updateCount = (): void => {
			try {
				this.countdown--;
				const s = this.countdown > 1 ? 's' : '';
				const msg = `The game will start in ${this.countdown} second${s}.`;

				const payload = PayloadFactory.createGameStartPayload(
					room.name,
					this.countdown > 0 ? 'time' : 'start',
					this.countdown > 0 ? msg : undefined,
				);

				room.sendTimer(payload);
				if (this.countdown === 0) {
					if (!this.lock) {
						this.lock = room.lock = true;
					}
					room.startGame(player);
					this.resetCountdown();
				} else {
					this.timerId = setTimeout(updateCount, 1000);
					TimeoutManager.addTimeout(this.timerId);
				}
			} catch (e) {
				this.timerId = null;
			}
		};

		this.resetCountdown();
		updateCount();
	}

	public resetCountdown(): void {
		if (!this.lock) {
			this.countdown = parseInt(process.env.START_GAME_TIMER ?? '10', 10);
			if (this.timerId) {
				clearTimeout(this.timerId);
			}
		}
	}
}

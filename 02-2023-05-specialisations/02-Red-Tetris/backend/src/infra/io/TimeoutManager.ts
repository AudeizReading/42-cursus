export class TimeoutManager {
	private static _timeouts: NodeJS.Timeout[] = [];
	private static _intervals: NodeJS.Timeout[] = [];

	private static clearAllTimeouts(): void {
		TimeoutManager._timeouts.forEach((timeout) => {
			clearTimeout(timeout);
		});
	}

	private static clearAllInterval(): void {
		TimeoutManager._intervals.forEach((interval) => {
			clearInterval(interval);
		});
	}

	public static addTimeout(timeout: NodeJS.Timeout): void {
		TimeoutManager._timeouts.push(timeout);
	}

	public static addInterval(interval: NodeJS.Timeout): void {
		TimeoutManager._intervals.push(interval);
	}

	public static clearAll(): void {
		TimeoutManager.clearAllTimeouts();
		TimeoutManager.clearAllInterval();
	}
}

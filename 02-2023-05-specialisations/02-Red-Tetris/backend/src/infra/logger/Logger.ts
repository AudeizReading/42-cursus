import fs from 'fs';

export class Logger {
	private logFileName: string;
	private stream: fs.WriteStream;
	private endSymbols: string = `${'>'.repeat(60)}\n`;

	public constructor() {
		if (process.env.DEV || process.env.UNITSTESTS) {
			this.logFileName = `${process.cwd()}/logs/devlogs.txt`;
			console.log(`Starting log at ${this.logFileName}`);
		} else {
			this.logFileName = `${process.cwd()}/logs/${Date.now()}.txt`;
		}
		this.stream = fs.createWriteStream(this.logFileName, {
			flags: 'a',
			encoding: 'utf8',
			autoClose: true,
		});
		this.log(`Starting log at ${this.logFileName}`);
	}

	private stamp(): string {
		return new Date().toISOString();
	}

	private addStamp(content: string): string {
		return `[${this.stamp()}]:${content.toString().toUpperCase()}`;
	}

	private setContent(message: string, context: string = 'logging'): string {
		let content = this.addStamp(`start ${context}\n`);
		content += `${message}\n`;
		content += this.addStamp(`end ${context}\n`);
		content += this.endSymbols;
		return content;
	}

	private log(message: string): void {
		this.write(this.setContent(message));
	}

	public logContext(message: string, context?: string, format?: string): void {
		if (!format && !context) {
			this.log(message);
		} else {
			this.write(this.setContent(message, context));

			if (process.env.DEV) {
				if (format) console.log(`${context}\n${format}`);
			}
		}
	}

	private write(content: string): void {
		this.stream.write(content, this.logError);
	}

	private logError(err: Error | null | undefined): void {
		if (err) {
			console.log('LOG ERROR', err);
		}
	}
}
export const logger = new Logger();

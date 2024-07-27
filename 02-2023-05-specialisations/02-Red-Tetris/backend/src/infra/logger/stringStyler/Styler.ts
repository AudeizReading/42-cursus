import { dashSeparator, dotSeparator, repeatTab } from '.';
import { colors } from '..';

export type StyleConfig = {
	color?: string;
	backgroundColor?: string;
	underline?: boolean;
	bold?: boolean;
	indentation?: number;
	italic?: boolean;
	inverse?: boolean;
	threshold?: number;
	padding?: number;
	paddingSide?: 'left' | 'right' | 'both' | 'none';
	paddingString?: string;
	listString?: string;
	separator?: string;
	openSeq?: string;
	closeSeq?: string;
	wrap?: {
		open?: string;
		close?: string;
		right?: string;
	};
};

export class Styler {
	private config: StyleConfig;

	public constructor(config: StyleConfig) {
		this.config = config;
		this.setThresold();
	}

	public setConfig(config: StyleConfig): void {
		this.config = { ...this.config, ...config };
		this.setThresold();
	}

	public getConfig(): StyleConfig {
		return this.config;
	}

	public setThresold(): void {
		const padding = this.config.padding ?? 0;
		const open = this.config?.wrap?.open?.length ?? 0;
		const close = this.config?.wrap?.close?.length ?? 0;
		const right = this.config?.wrap?.right?.length ?? 0;
		this.config.threshold = padding - open - close - right;
	}

	private bold(text: string): string {
		return `${colors.bold}${text}${colors.reset}`;
	}

	private italic(text: string): string {
		return `${colors.italic}${text}${colors.reset}`;
	}

	private underline(text: string): string {
		return `${colors.underline}${text}${colors.reset}`;
	}

	private inverse(text: string): string {
		return `${colors.reverse}${text}${colors.reset}`;
	}

	private colorize(text: string): string {
		let coloured = '';
		if (this.config.backgroundColor) {
			coloured = coloured.concat(`${this.config.backgroundColor}`);
		}
		if (this.config.color) {
			coloured = coloured.concat(`${this.config.color}`);
		}

		coloured = coloured.concat(`${text}`);
		const colorPattern = new RegExp(`\\x1b\\[\\d+m`, 'g');
		if (colorPattern.test(coloured)) {
			coloured = coloured.concat(`${colors.reset}`);
		}
		return coloured;
	}

	private padding(text: string): string {
		const _t = text;

		if (!this.config.padding) return _t;
		if (this.config.paddingString === undefined) {
			this.config.paddingString = ' ';
		}
		const _p = this.config.paddingString.repeat(this.config.padding);
		const _p2 = this.config.paddingString.repeat(this.config.padding / 2);
		switch (this.config.paddingSide) {
			case 'left':
				return `${_p}${_t}`;
			case 'right':
				return `${_t}${_p}`;
			case 'both':
				return `${_p2}${_t}${_p2}`;
			default:
				return _t;
		}
	}

	private cleanString(text: string): string {
		if (text.includes(`\x1b`)) {
			const regex = /\x1b[^m]*m/g;
			const openRegex = /\x1b[^m0]*m/g;
			const closeRegex = /\x1b\[0m/g;

			const matches = text.match(regex);
			const openMatches = text.match(openRegex);
			const closeMatches = text.match(closeRegex);
			const strWithoutColors = text.replace(regex, '');

			const threshold = this.config.threshold ?? 0;
			if (strWithoutColors.length > threshold) {
				if (matches) {
					if (openMatches) {
						for (let i = 0; i < openMatches.length; i++) {
							this.config.openSeq += openMatches[i];
						}
					}
				}
				if (matches) {
					if (closeMatches) {
						for (let i = 0; i < closeMatches.length; i++) {
							this.config.closeSeq += closeMatches[i];
						}
					}
				}
				return strWithoutColors.slice(0, threshold);
			}
			return strWithoutColors;
		}
		return text;
	}

	private wrap(text: string, side: 'open' | 'close' | 'right'): string {
		switch (side) {
			case 'open':
				return `${this.config?.wrap?.open}${text}`;
			case 'close':
				return `${text}${this.config?.wrap?.close}`;
			case 'right':
				return `${text}${this.config?.wrap?.right}`;
			default:
				return text;
		}
	}

	public applyStyle(text: string, mode: 'raw' | 'pretty'): string {
		let styledText = this.cleanString(text);

		// Appliquer la couleur
		if (mode === 'pretty') {
			if (this.config.color) {
				styledText = this.colorize(styledText);
			}

			if (this.config.backgroundColor) {
				styledText = this.colorize(styledText);
			}

			if (this.config.bold) {
				styledText = this.bold(styledText);
			}

			// Appliquer l'italique
			if (this.config.italic) {
				styledText = this.italic(styledText);
			}

			// Appliquer le soulignement
			if (this.config.underline) {
				styledText = this.underline(styledText);
			}

			// Appliquer l'inverse
			if (this.config.inverse) {
				styledText = this.inverse(styledText);
			}
		}

		if (this.config?.wrap?.open) {
			styledText = this.wrap(styledText, 'open');
		}

		if (this.config?.wrap?.open) {
			styledText = this.wrap(styledText, 'close');
		}

		if (this.config?.wrap?.right) {
			styledText = this.wrap(styledText, 'right');
		}

		if (this.config.listString) {
			styledText = this.config.listString + styledText;
		}
		// Appliquer le padding
		if (this.config.padding) {
			styledText = this.padding(styledText);
		}

		if (this.config.indentation) {
			styledText = repeatTab(this.config.indentation) + styledText;
		}

		if (this.config.separator) {
			styledText += '\n' + repeatTab(this.config.indentation ?? 0) + this.config.separator;
		}

		return styledText;
	}

	public getStyledText(text: string): { raw: string; pretty: string } {
		return {
			raw: this.applyStyle(text, 'raw'),
			pretty: this.applyStyle(text, 'pretty'),
		};
	}
}

export class KeyStyler extends Styler {
	public constructor() {
		super({
			padding: 5,
			paddingSide: 'right',
			wrap: { right: ':' },
			indentation: 1,
			italic: true,
		});
	}
}

export class ValueStyler extends Styler {
	public constructor() {
		super({
			padding: 10,
			paddingSide: 'left',
			wrap: { open: '<', close: '>' },
			color: colors.fBlue,
		});
	}
}

export class TextStyler extends Styler {
	public constructor() {
		super({
			paddingSide: 'left',
			wrap: { right: ':' },
			indentation: 1,
			backgroundColor: colors.bBlue,
			color: colors.fBlack,
		});
	}
}

export class ArrayStyler extends Styler {
	public constructor() {
		super({
			indentation: 1,
			listString: '+ ',
			separator: dashSeparator,
		});
	}

	public get internalArrayStyler(): Styler {
		return new Styler({
			indentation: 2,
			listString: '- ',
			separator: dotSeparator,
			padding: 5,
			paddingSide: 'left',
		});
	}
}

export class BasicDataStylers {
	private keyStyler: KeyStyler;
	private valueStyler: ValueStyler;
	private textStyler: TextStyler;
	private firstLevelStyler: ArrayStyler;
	private seconLevelStyler: Styler;

	public constructor() {
		this.keyStyler = new KeyStyler();
		this.valueStyler = new ValueStyler();
		this.textStyler = new TextStyler();
		this.firstLevelStyler = new ArrayStyler();
		this.seconLevelStyler = this.firstLevelStyler.internalArrayStyler;
	}

	public get stylers(): { [key: string]: Styler } {
		return {
			keyStyler: this.keyStyler,
			valueStyler: this.valueStyler,
			textStyler: this.textStyler,
			firstLevelStyler: this.firstLevelStyler,
			seconLevelStyler: this.seconLevelStyler,
		};
	}
}

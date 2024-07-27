import { isMapIterator, isSetIterator } from 'util/types';
import { StringsLoggingFormat, Styler } from '.';
import { isTypeOfUndefined } from '../../../base/typeGuards';

export class Formatter<T> {
	private stylers: { [key: string]: Styler };

	public constructor(stylers: { [key: string]: Styler }) {
		this.stylers = stylers;
	}

	public format(data: T | T[] | T[][] | { key: string; value: T }): StringsLoggingFormat {
		if (data === null || data === undefined) {
			return this.formatValue('There is no data to format' as T, this.stylers.textStyler);
		}
		if (Array.isArray(data)) {
			if (Array.isArray(data[0])) {
				return this.formatArrayOfArray(data as T[][], this.stylers);
			} else {
				return this.formatArray(data as T[], this.stylers, 0);
			}
		} else if (typeof data === 'object') {
			return this.formatObject(data as { [key: string]: unknown }, this.stylers, 0);
		} else {
			return this.formatValue(data as T, this.stylers.textStyler);
		}
	}

	private formatArrayOfArray(
		data: T[][],
		stylers: { [key: string]: Styler },
		label?: string,
		level?: number,
	): StringsLoggingFormat {
		// Appliquer les stylers à chaque élément de chaque sous-tableau
		const { raw, pretty } = data.reduce(
			(acc, value, i) => {
				const _l = (String(label) ?? ``).concat(`[${i}]\n`);
				if (Array.isArray(value)) {
					const { raw, pretty } = this.formatValue(
						_l + this.formatArray(value, stylers, (level ?? 0) + 1),
						stylers.firstLevelStyler,
					);

					return {
						raw: acc.raw.concat(raw),
						pretty: acc.pretty.concat(pretty),
					};
				}
				return {
					raw: acc.raw.concat('SCHMIBLIK\n'),
					pretty: acc.pretty.concat('SCHMIBLIK\n'),
				};
			},
			{ raw: '', pretty: '' },
		);
		return { raw, pretty };
	}

	private formatArray<T>(data: T[], stylers: { [key: string]: Styler }, level: number): StringsLoggingFormat {
		// Appliquer les stylers à chaque élément du tableau
		const { raw, pretty } = data.reduce(
			(acc, value) => {
				if (Array.isArray(value)) {
					return this.formatArray(value, stylers, level + 1);
				} else if (typeof value === 'object') {
					return this.formatObject(value as { [key: string]: unknown }, stylers, level + 1);
				} else {
					const _d = (String(value) ?? `NO VALUE`).concat('\n');
					const { seconLevelStyler } = stylers;
					const { raw, pretty } = this.formatValue(_d, seconLevelStyler);

					return { raw: acc.raw.concat(raw), pretty: acc.pretty.concat(pretty) };
				}
			},
			{ raw: '', pretty: '' },
		);

		return { raw, pretty };
	}

	private formatObject<T extends { [key: string]: unknown }>(
		data: T,
		stylers: { [key: string]: Styler },
		level: number = 0,
	): StringsLoggingFormat {
		// Appliquer les stylers à chaque élément du tableau
		if (isTypeOfUndefined(data) || data === null) {
			return { raw: '', pretty: '' };
		}
		const _stylers = stylers;
		const { keyStyler, valueStyler, textStyler } = _stylers;

		const incrementedStylers = _stylers;

		const { raw, pretty } = Object.entries(data).reduce(
			// Pour chaque data d
			(acc, d) => {
				// On recup la clé et la valeur de d
				const [key, value] = d;

				// Si la clé n'est pas un string, on ne l'affiche pas
				if (typeof key !== 'string') {
					return acc;
				}

				// const keyStyler = _stylers.keyStyler;
				const atomicTypesRegex = /string|number|boolean/;

				// si value est un type atomic (qu'on ne peut pas decouper plus)
				if (atomicTypesRegex.test(typeof value)) {
					const { raw, pretty } = this.formatKeyValue<string>(
						{ key, value: String(value) },
						{
							keyStyler,
							valueStyler,
						},
					);
					return {
						raw: acc.raw.concat(raw, '\n'),
						pretty: acc.pretty.concat(pretty, '\n'),
					};
				} else {
					// si la value n'est pas d'un type atomique, on rajoute un level d'indentation
					const resultKey = this.formatValue(key, textStyler);
					let raw = resultKey.raw.concat('\n');
					let pretty = resultKey.pretty.concat('\n');

					let result: StringsLoggingFormat = { raw: '', pretty: '' };
					if (
						Array.isArray(value) ||
						(value !== null && (value instanceof Set || isSetIterator(value) || isMapIterator(value)))
					) {
						if (Array.isArray(value) && Array.isArray(value[0]))
							result = this.formatArrayOfArray(value, incrementedStylers, key, (level ?? 0) + 1);
						else {
							result = this.formatArray(
								Array.isArray(value) ? value : Array.from(value as unknown as Iterable<unknown>),
								incrementedStylers,
								(level ?? 0) + 1,
							);
						}
					} else if (typeof value === 'object') {
						if (value instanceof Map) {
							const transform = Object.fromEntries(value);
							result = this.formatObject(
								transform as { [key: string]: unknown },
								incrementedStylers,
								(level ?? 0) + 1,
							);
						} else {
							result = this.formatObject(
								value as { [key: string]: unknown },
								incrementedStylers,
								(level ?? 0) + 1,
							);
						}
					}
					raw += result?.raw;
					pretty += result.pretty;
					return {
						raw: acc.raw.concat(raw, '\n'),
						pretty: acc.pretty.concat(pretty, '\n'),
					};
				}
			},
			{ raw: '', pretty: '' },
		);

		return { raw, pretty };
	}

	private formatKeyValue<T>(
		data: { key: string; value: T },
		stylers: { [key: string]: Styler },
	): StringsLoggingFormat {
		// Appliquer les stylers à la clé et à la valeur
		const { keyStyler, valueStyler } = stylers;
		const { key, value } = data;
		const { raw, pretty } = [this.formatValue(key, keyStyler), this.formatValue(value, valueStyler)].reduce(
			(acc, { raw, pretty }) => ({ raw: `${acc.raw}${raw}`, pretty: `${acc.pretty}${pretty}` }),
			{ raw: '', pretty: '' },
		);

		return { raw, pretty };
	}

	private formatValue<T>(value: T, styler: Styler): StringsLoggingFormat {
		// Appliquer chaque styler à la valeur
		return styler.getStyledText(String(value));
	}
}

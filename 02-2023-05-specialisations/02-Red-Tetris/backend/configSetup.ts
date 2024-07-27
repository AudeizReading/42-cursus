import * as fs from 'fs';

const controller = new AbortController();
const { signal } = controller;

type Env = {
	key: string;
	value: string;
};

const env: Env[] = [
	{ key: 'PORT', value: '8080' },
	{ key: 'HOST', value: 'localhost' },
	{ key: 'PROTOCOL', value: 'ws' },
	{ key: 'TICKS', value: '128' },
	{ key: 'TICKS_INTERVAL_MS', value: '1000' },
	{ key: 'DESTROY_TIMER', value: '15' },
	{ key: 'DISCO_TIMER', value: '15' },
	{ key: 'START_GAME_TIMER', value: '10' },
];

function replace(key: string, value: string): void {
	const elt = env.find((e) => e.key === key);
	if (elt) elt.value = value;
}

if (process.env.UNITSTESTS) {
	replace('DESTROY_TIMER', '1');
	replace('DISCO_TIMER', '1');
	replace('START_GAME_TIMER', '5');
	replace('TICKS', '128');
} else if (process.env.DEV) {
	replace('DESTROY_TIMER', '10');
	replace('DISCO_TIMER', '10');
	replace('START_GAME_TIMER', '10');
}

const body = env
	.map((e) => `${e.key}=${e.value}`)
	.toString()
	.split(',')
	.join('\n');

fs.access('./.env', fs.constants.F_OK, (err) => {
	if (err) {
		if (process.env.DEV || process.env.UNITSTESTS) {
			fs.writeFile('./.env', body, { signal }, (error) => {
				console.log(`\x1b[33m*** .env created ***\x1b[0m`);
				if (error) {
					console.error(`***[${error?.name}:${error?.message}]***`);
					controller.abort();
				}
			});
		} else {
			console.log(
				`\x1b[31m*** YOU SHOULD BE IN PROD (ask to sysadmin if no .env is provided). \
No .env should be in backend folder ***\x1b[0m`,
			);
		}
	} else {
		console.log(`\x1b[31m*** .env already exists ***\x1b[0m`);
	}
});

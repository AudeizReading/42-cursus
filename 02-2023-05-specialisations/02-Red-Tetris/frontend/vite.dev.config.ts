import type { PluginOption, UserConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';
import configProd from './vite.prod.config';

const configDev: UserConfig = {
	...configProd,
	plugins: [
		[...(configProd.plugins as PluginOption[])],
		istanbul({
			include: 'src/*',
			exclude: ['node_modules', 'tests/', 'src/lib/game/*'],
			extension: ['.ts', '.svelte'],
			requireEnv: false,
			forceBuildInstrument: true,
		}),
	],
	build: {
		sourcemap: true,
	},
};

export default configDev;

import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const configProd: UserConfig = {
	plugins: [sveltekit()],
	server: {
		host: true,
	},
};

export default configProd;

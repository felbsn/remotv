import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		alias: {
			"$lib": "src/lib",
			"$scripts": "src/scripts",
			"$styles": "src/styles",
		},
		adapter: adapterStatic({
			assets: './build/gui',
			pages: './build/gui',
		})
	}
};

export default config;

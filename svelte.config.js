// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		trailingSlash: "always",
		adapter: adapter(
			{
				assets: './build/gui',
				pages: './build/gui',
			}
		),
		alias: {
			"$lib": "src/lib",
			"$scripts": "src/scripts",
			"$styles": "src/styles",
		},
	}
};

export default config;

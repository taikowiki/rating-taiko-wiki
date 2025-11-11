import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	onwarn(warning, defaultHandler) {
		switch (warning.code) {
			case "a11y_click_events_have_key_events":
			case "a11y_no_noninteractive_element_interactions": {
				return;
			}
			default: {
				defaultHandler(warning);
			}
		}
	}
};

export default config;

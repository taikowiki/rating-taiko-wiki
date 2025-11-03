import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import viteMkcert from 'vite-plugin-mkcert';

export default defineConfig({
	plugins: [sveltekit(), viteMkcert()],
	server: {
		https: true
	}
});

import mkcert from "vite-plugin-mkcert"
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';


export default defineConfig({
	plugins: [sveltekit(),
		mkcert()
	],
	server: {
		https: true,
		proxy: {}, // essential to avoid "can't use Symbol where you need a string" error
	},
})

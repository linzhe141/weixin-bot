import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		port: 4521,
		proxy: {
			'/api': {
				target: 'http://localhost:8912',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});

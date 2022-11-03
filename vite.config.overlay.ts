import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte({ emitCss: false, preprocess: sveltePreprocess() })],
    resolve: {
        alias: {
            '$lib': path.resolve('./src/lib'),
            '$scripts': path.resolve('./src/scripts'),
            '$styles': path.resolve('./src/styles'),
        }
    },
    build: {
        outDir: 'build/overlay',
        emptyOutDir: true,
        cssCodeSplit: false,
        rollupOptions: {
            input: ["src/overlay/entry.ts"],
            output: {
                format: 'iife',
                entryFileNames: 'main.js',
                inlineDynamicImports: true,
            }
        }
    }
})

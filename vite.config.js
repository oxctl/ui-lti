import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';

const peerDependencies = Object.keys(pkg.peerDependencies || {});

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        resolve()
    ],
    build: {
        lib: {
            entry: 'src/index.js',
            formats: ['es']
        },
        rollupOptions: {
            external: [...peerDependencies, 'react/jsx-runtime'],
            output: {
                exports: 'named',
                // This is so that we can have tree shaking working.
                preserveModules: true,
                format: 'es'
                // generatedCode: 'es2015',
            },
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
    }
})

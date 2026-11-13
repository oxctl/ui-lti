import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import { readFile } from 'node:fs/promises'
import { basename, dirname, posix, resolve as resolvePath } from 'node:path'

const peerDependencies = Object.keys(pkg.peerDependencies || {});

// Vite inlines assets in library mode. Emit font files and keep URL imports
// in the browser build so downstream bundlers can resolve and serve them.
function libraryFontAssets() {
    const fontAssets = new Map()
    return {
        name: 'library-font-assets',
        apply(config, { command }) {
            return command === 'build' && !!config.build?.lib
        },
        enforce: 'pre',
        resolveId(source, importer) {
            if (importer && source.startsWith('./fonts/') && source.endsWith('.woff2?url')) {
                return '\0library-font:' + resolvePath(dirname(importer), source.slice(0, -4))
            }
        },
        async load(id) {
            if (id.startsWith('\0library-font:')) {
                const path = id.slice('\0library-font:'.length)
                this.addWatchFile(path)
                const reference = this.emitFile({
                    type: 'asset',
                    name: basename(path),
                    source: await readFile(path)
                })
                fontAssets.set(id, reference)
                return `export default import.meta.ROLLUP_FILE_URL_${reference}`
            }
        },
        renderChunk(code, chunk, options) {
            if (options.format !== 'es' || chunk.moduleIds.length !== 1) return
            const reference = fontAssets.get(chunk.moduleIds[0])
            if (!reference) return
            const relativePath = posix.relative(posix.dirname(chunk.fileName), this.getFileName(reference))
            const specifier = relativePath.startsWith('.') ? relativePath : './' + relativePath
            return { code: `export { default } from ${JSON.stringify(specifier + '?url')};`, map: null }
        }
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        resolve(),
        libraryFontAssets()
    ],
    build: {
        sourcemap: true,
        // As this library will be re-compiled by the host application, we don't need to minify it.
        minify: false,
        lib: {
            entry: 'src/index.ts',
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: [...peerDependencies, 'react/jsx-runtime'],
            output: {
                exports: 'named',
                // This is so that we can have tree shaking working.
                preserveModules: true,
                // generatedCode: 'es2015',
            },
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        // Reset mocks before each test
        restoreMocks: true
    }
})

import babel from 'rollup-plugin-babel';
import external from "rollup-plugin-peer-deps-external";
import json from 'rollup-plugin-json';

export default [
    {
        input: './src/index.js',
        output: [
            {
                dir: 'dist/es',
                format: 'es',
                exports: 'named',
                // This is so that we can have tree shaking working.
                preserveModules: true
            },
            {
                dir: 'dist/cjs',
                format: 'cjs',
            }
        ],
        plugins: [
            babel({
                exclude: 'node_modules/**',
                presets: ["@babel/preset-react"]
            }),
            external(),
            json(),
        ]
    }
]
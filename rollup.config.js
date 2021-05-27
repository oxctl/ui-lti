import babel from 'rollup-plugin-babel';
import external from "rollup-plugin-peer-deps-external";
import commonjs from '@rollup/plugin-commonjs';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser'

export default [
    {
        input: './src/index.js',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs'
            }, 
            {
                file: 'dist/index.es.js',
                format: 'es',
                exports: 'named',
            }
        ],
        plugins: [
            babel({
                exclude: 'node_modules/**',
                presets: ["@babel/preset-react"]
            }),
            external(),
            commonjs(),
            json(),
            terser(),
        ]
    }
]
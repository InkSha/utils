import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import esbuild from 'rollup-plugin-esbuild'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import copy from 'rollup-plugin-copy'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rollup'
import pkg from './package.json' assert { type: 'json' }

const plugins = [
  alias({
    entries: [
      {
        find: '@',
        replacement: new URL('./src', import.meta.url).pathname,
      },
    ],
  }),
  resolve(),
  commonjs(),
  json(),
  typescript(),
  esbuild(),
  babel({
    babelHelpers: 'bundled',
    extensions: ['.js', '.vue'],
  }),
  copy({
    targets: [
      {
        dest: ['dist'],
        src: ['src/assets/*', '!src/assets/*.ts'],
        rename: (name, ext) => `assets/${name}.${ext}`,
      },
    ],
    expandDirectories: false,
  }),
  terser(),
]
const input = './src/index.ts'
export default defineConfig({
  input,
  output: [
    {
      dir: './dist',
      format: 'umd',
      entryFileNames: 'index.min.js',
      name: pkg.name,
    },
    {
      dir: './dist',
      format: 'esm',
      entryFileNames: 'index.min.mjs',
      name: pkg.name,
    },
  ],
  plugins,
})

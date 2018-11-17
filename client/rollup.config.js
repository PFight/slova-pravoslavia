const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const map = require('rollup-plugin-typescript-path-mapping');

module.exports = {
  input: 'src/editor/index.js',
  external: 'golden-layout',
  plugins: [
      resolve(),
      commonjs(),
      map({ tsconfig: true })
  ],
  output: {
    file: 'bundles/editor.min.js',
    format: 'iife',
    sourcemap: true,
    globals: {
     ['golden-layout']: 'GoldenLayout'
    },
    
  }
};
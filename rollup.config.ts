import typescript from 'rollup-plugin-typescript2'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import { bin, main, module } from './package.json'
import shebang from 'rollup-plugin-add-shebang'
import { terser } from 'rollup-plugin-terser'
const config = [
  {
    input: 'src/cli/index.ts',
    output: [
      {
        file: bin['vite-ssrg'],
        format: 'cjs',
        sourcemap: true
      }
    ],
    watch: {
      include: 'src/**'
    },
    external: [
      'fs',
      'path',
      'yargs/yargs',
      'express',
      'vite',
      'compression',
      'serve-static',
      'fs-extra',
      'consola',
      'recursive-readdir'
    ],

    plugins: [
      typescript({ useTsconfigDeclarationDir: false }),
      shebang(),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: module,
        format: 'es',
        sourcemap: true,
        exports: 'named'
      }
    ],
    watch: {
      include: 'src/**'
    },

    external: ['recursive-readdir'],

    plugins: [
      nodePolyfills(),
      typescript({ useTsconfigDeclarationDir: false }),
      terser()
    ]
  }
]

export default config

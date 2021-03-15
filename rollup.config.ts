// import sourceMaps from 'rollup-plugin-sourcemaps'
// import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import { bin } from './package.json'

const shebang = () => {
  return {
    name: 'shebang',
    renderChunk(code) {
      return '#!/usr/bin/env node\n' + code
    }
  }
}

const config = [
  {
    input: 'src/cli/ssr.ts',
    output: [
      {
        file: bin['vite-ssr'],
        format: 'cjs',
        sourcemap: true
      }
      // {
      //   file: module,
      //   format: 'es',
      //   sourcemap: true
      // }
    ],
    watch: {
      include: 'src/**'
    },
    plugins: [
      // terser(),
      typescript({ useTsconfigDeclarationDir: false }),
      shebang()
      // sourceMaps()
    ]
  },
  {
    input: 'src/cli/ssg.ts',
    output: [
      {
        file: bin['vite-ssg'],
        format: 'cjs',
        sourcemap: true
      }
    ],
    watch: {
      include: 'src/**'
    },
    plugins: [
      // terser(),
      typescript({ useTsconfigDeclarationDir: false }),
      shebang()
      // sourceMaps()
    ]
  },
  {
    input: 'src/entry-server.tsx',
    output: [
      {
        file: 'dist/entry-server.js',
        format: 'cjs',
        sourcemap: true
      }
    ],
    watch: {
      include: 'src/**'
    },
    plugins: [typescript({ useTsconfigDeclarationDir: false })]
  }
]

export default config

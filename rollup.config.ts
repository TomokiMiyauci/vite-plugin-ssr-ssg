// import sourceMaps from 'rollup-plugin-sourcemaps'
// import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import { bin } from './package.json'

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
      typescript({ useTsconfigDeclarationDir: false })
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
      typescript({ useTsconfigDeclarationDir: false })
      // sourceMaps()
    ]
  }
]

export default config

import typescript from 'rollup-plugin-typescript2'

import { bin, main, module } from './package.json'

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
    plugins: [
      // terser(),
      typescript({ useTsconfigDeclarationDir: false }),
      shebang()
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: module,
        format: 'es',
        sourcemap: true
      }
    ],
    watch: {
      include: 'src/**'
    },

    plugins: [typescript({ useTsconfigDeclarationDir: false })]
  },
  {
    input: 'src/react/index.ts',
    output: [
      {
        file: 'react/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'react/index.esm.js',
        format: 'es',
        sourcemap: true
      }
    ],
    watch: {
      include: 'src/react/*'
    },

    plugins: [
      typescript({
        tsconfigOverride: {
          include: ['src/react/*']
        }
      })
    ]
  },
  {
    input: 'src/preact/index.ts',
    output: [
      {
        file: 'preact/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'preact/index.esm.js',
        format: 'es',
        sourcemap: true
      }
    ],
    watch: {
      include: 'src/preact/*'
    },

    plugins: [
      typescript({
        tsconfigOverride: {
          include: ['src/preact/*']
        }
      })
    ]
  },
  {
    input: 'src/vue3/index.ts',
    output: [
      {
        file: 'vue3/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'vue3/index.esm.js',
        format: 'es',
        sourcemap: true
      }
    ],
    watch: {
      include: 'src/vue3/*'
    },

    plugins: [
      typescript({
        tsconfigOverride: {
          include: ['src/vue3/*']
        }
      })
    ]
  }
]

export default config

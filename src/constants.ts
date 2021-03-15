export const isTest =
  process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
export const ROOT_PATH = require('app-root-path').path
export const EXTENSIONS = ['jsx', 'tsx', 'ts', 'js', 'vue'] as const
export const PIPED_EXTENSIONS = EXTENSIONS.join('|')

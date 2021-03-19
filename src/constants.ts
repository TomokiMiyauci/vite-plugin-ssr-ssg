export const isTest =
  process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
export const ROOT_PATH = require('app-root-path').path
export const EXTENSIONS = ['jsx', 'tsx', 'ts', 'js', 'vue'] as const
export const PIPED_EXTENSIONS = EXTENSIONS.join('|')
export const NAME = 'vite:ssr-ssg'

export const CYAN = '\u001b[36m'
export const GREEN = '\u001b[32m'
export const RESET = '\u001b[0m'
export const GRAY = '\u001b[90m'
export const YELLOW = '\u001b[33m'
